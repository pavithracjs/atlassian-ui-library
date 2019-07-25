import { DEFAULT_TAG } from './../../constants';
import chalk from 'chalk';
//@ts-ignore
import simpleGit from 'simple-git';

import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import { IPackageJSON } from '../../util/package-json';
import { DependencyType, UpgradeEvent } from '../../types';
import {
  PopulateHistoricDataFlags,
  DependencyMap,
  AkPackageChange,
} from './types';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';
import {
  getChangesSince,
  tagCommit,
  doesTagExist,
  refetchTag,
  getHash,
} from '../../util/git';
import { ListLogSummary } from 'simple-git/typings/response';
import { generateCSV } from './util/generate-csv';

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
  reset: boolean;
  tag: string;
};

const parseAkDependencyVersions = (
  depMap: { [name: string]: string },
  type: DependencyType,
): DependencyMap => {
  return fromEntries(
    Object.entries(depMap)
      .filter(([name]) => name.includes('@atlaskit'))
      .map(([name, version]) => [name, { version, type }]),
  );
};

const getAkDependencyVersionsFromHash = async (
  hash: string,
): Promise<DependencyMap> => {
  let akDeps: DependencyMap = {};
  try {
    const json = await loadFileFromGitHistory(hash, 'package.json');
    const parsed: IPackageJSON = JSON.parse(json);

    akDeps = {
      ...parseAkDependencyVersions(
        parsed.devDependencies || {},
        'devDependency',
      ),
      ...parseAkDependencyVersions(parsed.dependencies || {}, 'dependency'),
      ...parseAkDependencyVersions(
        parsed.peerDependencies || {},
        'peerDependency',
      ),
      ...parseAkDependencyVersions(
        parsed.optionalDependencies || {},
        'optionalDependency',
      ),
    };
  } catch (e) {
    console.error(
      chalk.red(`Error parsing package.json most likely, commit ${hash}`),
    );
    console.error(e);
  }

  return akDeps;
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
  packageChangesLog: ListLogSummary,
  prevRunHash: string | null,
): Promise<{
  allPackageChanges: AkPackageChange[];
  allUpgradeEvents: UpgradeEvent[];
}> => {
  const allPackageChanges: AkPackageChange[] = [];
  const allUpgradeEvents: UpgradeEvent[] = [];
  const prevRunAkDeps = prevRunHash
    ? await getAkDependencyVersionsFromHash(prevRunHash)
    : {};
  for (
    let historyListIndex = 0;
    historyListIndex < packageChangesLog.all.length;
    historyListIndex++
  ) {
    // Using a for loop because running all promises in parallel spawns too many processes
    // Batching would be more efficient but in it's current form it's not unreasonably slow.
    let item = packageChangesLog.all[historyListIndex];

    const akDeps = await getAkDependencyVersionsFromHash(item.hash);
    if (Object.keys(akDeps).length > 0) {
      const packageChange = {
        date: new Date(item.date).toISOString(),
        akDeps,
      };
      const prevAkDeps =
        allPackageChanges.length > 0
          ? allPackageChanges[allPackageChanges.length - 1].akDeps
          : prevRunAkDeps;
      const upgradeEvents = getUpgradeEventsFromPkgChange(prevAkDeps, akDeps, {
        date: packageChange.date,
        commitHash: item.hash,
      });
      if (upgradeEvents.length > 0) {
        allUpgradeEvents.push(...upgradeEvents);
        allPackageChanges.push(packageChange);
      }
    }
  }

  return { allPackageChanges, allUpgradeEvents };
};

export default async function populateProduct(flags: PopulateProductFlags) {
  const tag = flags.tag || DEFAULT_TAG;
  if (!flags.reset) {
    await refetchTag(tag);
    const tagExists = await doesTagExist(tag);
    if (!tagExists) {
      console.error(
        chalk.red(
          `Tag '${tag}' does not exist. Must use --reset for populating from start of history.`,
        ),
      );
      process.exit(1);
    }
  }
  const detectSince = flags.reset ? undefined : tag;
  const log = await getChangesSince(detectSince);

  if (log.all.length === 0) {
    console.log(`No package.json changes found since '${tag}' tag.`);
    return;
  }

  const prevRunHash = flags.reset ? null : await getHash(tag);

  const { allPackageChanges, allUpgradeEvents } = await getEventsFromHistory(
    log,
    prevRunHash,
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

  if (allUpgradeEvents.length > 0) {
    await sendAnalytics(allUpgradeEvents, {
      dev: flags.dev,
      limit: flags.limit,
      product: flags.product,
      skipPrompt: !flags.interactive,
    });
  } else {
    console.log(
      `Found no AK dependency changes since last run from tag "${tag}"'`,
    );
  }

  console.log('Updating tag to current commit...');

  await tagCommit(DEFAULT_TAG);

  console.log(`Finished. Run 'git push origin ${tag}'.`);
}
