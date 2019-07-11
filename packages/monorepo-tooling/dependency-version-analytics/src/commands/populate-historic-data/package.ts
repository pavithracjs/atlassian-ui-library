import { PackageVersionHistory } from '../../util/get-package-version-history';
import semver from 'semver';
import { PopulateHistoricDataFlags } from './types';
import { UpgradeEvent } from '../../types';
import getPackageVersionHistory from '../../util/get-package-version-history';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';

export type PopulatePackageFlags = PopulateHistoricDataFlags & {
  since?: string;
  pkg: string;
};

const createAnalyticsEvents = (
  packageName: string,
  packageVersionHistory: PackageVersionHistory,
  since?: string,
): UpgradeEvent[] => {
  const upgradeEvents = Object.entries(packageVersionHistory)
    .filter(
      ([version, date]) =>
        semver.valid(version) &&
        (!since || Number(new Date(date)) > Number(new Date(since))),
    )
    .sort((a, b) => Number(new Date(a[1])) - Number(new Date(b[1])))
    .map(([version, time], i, arr) => {
      const previousVersion = arr[i - 1] && arr[i - 1][0];
      return createUpgradeEvent(packageName, version, previousVersion, time, {
        historical: true,
      });
    })
    .filter((e): e is UpgradeEvent => e != null);

  return upgradeEvents;
};

export default async function populatePackage(
  flags: PopulatePackageFlags,
): Promise<UpgradeEvent[]> {
  if (!flags.pkg.startsWith('@atlaskit/')) {
    throw new Error(`Package must start with '@atlaskit/'`);
  }
  const packageVersionHistory = await getPackageVersionHistory(flags.pkg);

  if (flags.since && Number.isNaN(Number(new Date(flags.since)))) {
    throw new Error(`'since' flag is an invalid date`);
  }

  const analyticsEvents = createAnalyticsEvents(
    flags.pkg,
    packageVersionHistory,
    flags.since,
  );

  if (flags.dryRun) {
    console.log(JSON.stringify(analyticsEvents));
    return analyticsEvents;
  }

  await sendAnalytics(analyticsEvents, {
    dev: flags.dev,
    limit: flags.limit,
    product: 'atlaskit',
  });

  return analyticsEvents;
}