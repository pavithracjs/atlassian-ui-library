import chalk from 'chalk';
//@ts-ignore
import simpleGit from 'simple-git';

import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import { IPackageJSON } from '../../util/package-json';
import { DependencyType, UpgradeEvent } from '../../types';
import { PopulateHistoricDataFlags } from './types';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';

// Object.fromEntries polyfill, remove when upgraded to node 10
function fromEntries(iterable: any) {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {},
  );
}

export type PopulateProductFlags = PopulateHistoricDataFlags & {
  csv: boolean;
  product: string;
};

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

type AkPackageChange = {
  akDeps: DependencyMap;
  date: string;
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

const generateCSV = (packageChanges: AkPackageChange[]) => {
  const csvData: CsvColumn = [['']];

  packageChanges.forEach(packageChange => {
    const firstColumn = csvData[0];
    const currentRow = firstColumn.push(packageChange.date) - 1;

    Object.entries(packageChange.akDeps).forEach(([name, { version }]) => {
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

const getUpgradeEventsFromPkgChange = (
  oldDeps: DependencyMap,
  newDeps: DependencyMap,
  { date, commitHash }: { date: string; commitHash: string },
): UpgradeEvent[] => {
  const addOrUpgradeEvents = Object.entries(newDeps)
    .map(([name, { version, type }]) => {
      return createUpgradeEvent(
        name,
        version,
        oldDeps[name] && oldDeps[name].version,
        date,
        {
          commitHash,
          dependencyType: type,
          historical: true,
        },
      );
    })
    .filter((e): e is UpgradeEvent => e != null);

  const removeEvents = Object.entries(oldDeps)
    .filter(([name]) => newDeps[name] == null)
    .map(([name, { version, type }]) => {
      return createUpgradeEvent(name, undefined, version, date, {
        commitHash,
        dependencyType: type,
        historical: true,
      });
    })
    .filter((e): e is UpgradeEvent => e != null);

  return [...addOrUpgradeEvents, ...removeEvents];
};

const getEventsFromHistory = async (
  historyLog: LogResult,
): Promise<{
  allPackageChanges: AkPackageChange[];
  allUpgradeEvents: UpgradeEvent[];
}> => {
  const allPackageChanges: AkPackageChange[] = [];
  const allUpgradeEvents: UpgradeEvent[] = [];
  for (
    let historyListIndex = 0;
    historyListIndex < historyLog.all.length;
    historyListIndex++
  ) {
    // Using a for loop because running all promises in parallel spawns too many processes
    // Batching would be more efficient but in it's current form it's not unreasonably slow.

    let item = historyLog.all[historyListIndex];

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
        const packageChange = {
          date: new Date(item.date).toUTCString(),
          akDeps,
        };
        const prevAkDeps =
          allPackageChanges.length > 1
            ? allPackageChanges[allPackageChanges.length - 1].akDeps
            : {};
        const upgradeEvents = getUpgradeEventsFromPkgChange(
          prevAkDeps,
          akDeps,
          {
            date: packageChange.date,
            commitHash: item.hash,
          },
        );
        if (upgradeEvents.length > 0) {
          allUpgradeEvents.push(...upgradeEvents);
          allPackageChanges.push(packageChange);
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

  return { allPackageChanges, allUpgradeEvents };
};

export default async function run(flags: PopulateProductFlags) {
  const log = await getHistory();

  const { allPackageChanges, allUpgradeEvents } = await getEventsFromHistory(
    log,
  );

  if (flags.csv) {
    const csv = generateCSV(allPackageChanges);
    console.log(csv);
    return;
  }

  if (flags.dryRun) {
    console.log(JSON.stringify(allUpgradeEvents));
    return;
  }

  await sendAnalytics(allUpgradeEvents, {
    dev: flags.dev,
    limit: flags.limit,
    product: flags.product,
  });

  console.log('Done.');
}
