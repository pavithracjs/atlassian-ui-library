import chalk from 'chalk';
//@ts-ignore
import simpleGit from 'simple-git';
import semver, { ReleaseType } from 'semver';
import { analyticsClient } from '@atlassiansox/analytics-node-client';
import inquirer from 'inquirer';

import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import { IPackageJSON } from '../../util/package-json';
import { PopulateHistoricDataFlags } from './types';

// Object.fromEntries polyfill, remove when upgraded to node 10
function fromEntries(iterable: any) {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {},
  );
}

export type PopulateProductFlags = PopulateHistoricDataFlags & {};

type LogResult = {
  all: ListLogLine[];
};

type ListLogLine = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
};

type CsvColumn = [[string]];

type DependencyMap = {
  [name: string]: {
    version: string;
    type: DependencyType;
  };
};

type ParsedInfo = {
  commitData: ListLogLine & {
    date: string;
  };
  json: IPackageJSON | null;
  akDeps: DependencyMap;
};

const getHistory = () =>
  new Promise<LogResult>((resolve, reject) => {
    simpleGit('./').log(
      ['--merges', '--first-parent', '--reverse', './package.json'],
      (err: any, result: LogResult) => {
        if (err !== null) {
          reject(err);
        }

        resolve(result);
      },
    );
  });

const generateCSV = (allParsedInfo: ParsedInfo[]) => {
  const csvData: CsvColumn = [['']];

  allParsedInfo.forEach(item => {
    const firstColumn = csvData[0];
    const currentRow = firstColumn.push(item.commitData.date) - 1;

    Object.entries(item.akDeps).forEach(([name, { version }]) => {
      let depColumnIndex = csvData.findIndex(item => item[0] === name);
      if (depColumnIndex === -1) {
        depColumnIndex = csvData.push([name]) - 1;
      }

      // console.log(csvData)
      csvData[depColumnIndex][currentRow] = version;
    });
  });

  for (let i = 0; i < csvData.length; i++) {
    for (let j = 0; j < csvData.length; j++) {
      if (typeof csvData[i][j] !== 'string') {
        // console.log('found empty cell');
        csvData[i][j] = '';
      }
    }

    if (i !== 0 && csvData[0].length < csvData[i].length) {
    }
  }

  const csvStrings: string[] = [];

  csvData.forEach(column => {
    if (!column) {
      return;
    }
    for (let rowIndex = 0; rowIndex < csvData[0].length; rowIndex++) {
      const rowItem = column[rowIndex] || '';

      if (typeof csvStrings[rowIndex] !== 'string') {
        csvStrings[rowIndex] = '';
      }

      csvStrings[rowIndex] += `"${rowItem}",`;
    }
  });

  return csvStrings.join('\n');
};

const getAkDependencyVersions = (
  depMap: { [name: string]: string },
  type: DependencyType,
): DependencyMap => {
  return fromEntries(
    Object.entries(depMap)
      // TODO: Should this be @atlaskit
      .filter(([name]) => name.includes('atlaskit'))
      .map(([name, version]) => [name, { version, type }]),
  );
};

type DependencyType =
  | 'devDependency'
  | 'dependency'
  | 'optionalDependency'
  | 'peerDependency';
type UpgradeType = 'add' | 'upgrade' | 'remove';
type SubUpgradeType = ReleaseType | null;

type UpgradeEvent = {
  dependencyName: string;
  dependencyType: DependencyType;
  versionString: string;
  major: string | null;
  minor: string | null;
  patch: string | null;
  date: string;
  upgradeType: UpgradeType;
  upgradeSubType: SubUpgradeType;
};

const getUpgradeEvents = (
  oldDeps: DependencyMap,
  newDeps: DependencyMap,
  parsedInfo: ParsedInfo,
): UpgradeEvent[] => {
  type DepInfo = {
    name: string;
    version: string;
    type: DependencyType;
    upgradeType: 'add' | 'upgrade';
    upgradeSubType: SubUpgradeType;
  };

  type RemoveDepInfo = DepInfo & {
    upgradeType: 'remove';
  };

  const addOrUpgradeDeps = Object.entries(newDeps)
    .map(([name, { version, type }]) => {
      let upgradeType: UpgradeType | undefined;
      let upgradeSubType: SubUpgradeType = null;
      if (!oldDeps[name]) {
        upgradeType = 'add';
      } else if (oldDeps[name].version !== version) {
        upgradeType = 'upgrade';

        const parsedOld = semver.coerce(oldDeps[name].version);
        const parsedNew = semver.coerce(version);
        if (parsedOld && parsedNew) {
          upgradeSubType = semver.diff(parsedOld.version, parsedNew.version);
        }
      }

      return { name, version, type, upgradeType, upgradeSubType };
    })
    .filter((v): v is DepInfo => v.upgradeType != null);

  const removedDeps = Object.entries(oldDeps)
    .map(([name, { version, type }]) => {
      const upgradeType: UpgradeType | undefined =
        newDeps[name] == null ? 'remove' : undefined;
      return { name, version, type, upgradeType };
    })
    .filter((v): v is RemoveDepInfo => v.upgradeType != null);

  const upgradeEvents: UpgradeEvent[] = [
    ...addOrUpgradeDeps,
    ...removedDeps,
  ].map(({ name, version, type, upgradeType, upgradeSubType }) => {
    const parsedVersion = semver.coerce(version);
    return {
      dependencyName: name,
      dependencyType: type,
      versionString: version,
      major: parsedVersion ? `${parsedVersion.major}` : null,
      minor: parsedVersion ? `${parsedVersion.minor}` : null,
      patch: parsedVersion ? `${parsedVersion.patch}` : null,
      date: parsedInfo.commitData.date,
      upgradeType,
      upgradeSubType: upgradeSubType || null,
    };
  });

  return upgradeEvents;
};

export default async function run(flags: PopulateProductFlags) {
  const log = await getHistory();
  const allParsedInfo: ParsedInfo[] = [];
  const allUpgradeEvents: UpgradeEvent[] = [];

  for (
    let historyListIndex = 0;
    historyListIndex < log.all.length;
    historyListIndex++
  ) {
    // Using a for loop because running all promises in parallel spawns too many processes
    // Batching would be more efficient but in it's current form it's not unreasonably slow.

    let item = log.all[historyListIndex];

    try {
      const json = await loadFileFromGitHistory(item.hash, 'package.json');
      const parsed: IPackageJSON = JSON.parse(json);

      const akDeps: DependencyMap = {
        ...getAkDependencyVersions(
          parsed.devDependencies || {},
          'devDependency',
        ),
        ...getAkDependencyVersions(parsed.dependencies || {}, 'dependency'),
        ...getAkDependencyVersions(
          parsed.peerDependencies || {},
          'peerDependency',
        ),
        ...getAkDependencyVersions(
          parsed.optionalDependencies || {},
          'optionalDependency',
        ),
      };

      if (Object.keys(akDeps).length > 0) {
        const parsedItem = {
          commitData: {
            ...item,
            date: new Date(item.date).toUTCString(),
          },
          json: parsed,
          akDeps,
        };
        const previousDeps =
          allParsedInfo.length > 1
            ? allParsedInfo[allParsedInfo.length - 1].akDeps
            : {};
        const upgradeEvents = getUpgradeEvents(
          previousDeps,
          akDeps,
          parsedItem,
        );
        if (upgradeEvents.length > 0) {
          allUpgradeEvents.push(...upgradeEvents);
          allParsedInfo.push(parsedItem);
        }
      }
    } catch (err) {
      console.error(
        chalk.red(
          `Error parsing package.json most likely, commit ${item.hash} ${
            item.date
          }`,
        ),
      );
      console.error(err);
    }
  }

  console.log(`Found ${allUpgradeEvents.length} ak dependency changes`);

  if (flags.csv) {
    const csv = generateCSV(allParsedInfo);
    console.log(csv);
    return;
  }

  if (flags.dryRun) {
    console.log(JSON.stringify(allUpgradeEvents));
    return;
  }

  const analyticsEnv = flags.dev ? 'dev' : 'prod';

  const client = analyticsClient({
    env: flags.dev ? 'dev' : 'prod',
    product: flags.product,
  });

  const answers: any = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: `Are you sure you want to send ${
        allUpgradeEvents.length
      } historical analytics events to '${analyticsEnv}' env for product '${
        flags.product
      }?`,
      default: false,
    },
  ]);

  if (!answers.continue) {
    console.log('Aborting');
    process.exit(0);
  }

  try {
    const promises = await Promise.all(
      allUpgradeEvents.map(event => {
        return client.sendTrackEvent({
          anonymousId: 'unknown',
          trackEvent: {
            tags: ['atlaskit'],
            source: '@atlaskit/dependency-version-analytics',
            action: 'upgraded',
            actionSubject: 'akDependency',
            attributes: {
              ...event,
            },
            origin: 'console',
            platform: 'bot',
          },
        });
      }),
    );
    console.log(
      chalk.green(
        `Sent ${promises.length} dependency upgrade analytics events`,
      ),
    );
  } catch (e) {
    console.error(chalk.red('Sending analytics failed'));
    console.error(e);
    process.exit(1);
  }
}
