import { PackageInfo } from './../../util/get-package-info';
import semver from 'semver';
import { PopulateHistoricDataFlags } from './types';
import { UpgradeEvent } from '../../types';
import getPackageInfo from '../../util/get-package-info';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';

export type PopulatePackageFlags = PopulateHistoricDataFlags & {
  pkg: string;
};

const createAnalyticsEvents = (
  packageName: string,
  packageInfo: PackageInfo,
): UpgradeEvent[] => {
  if (!packageInfo.data || !packageInfo.data.time) {
    throw new Error(`Malformed yarn info json for ${packageName}`);
  }
  const upgradeEvents = Object.entries(packageInfo.data.time)
    .filter(([version]) => semver.valid(version))
    .sort((a, b) => +new Date(a[1]) - +new Date(b[1]))
    .map(([version, time], i, arr) => {
      const previousVersion = arr[i - 1] && arr[i - 1][0];
      return createUpgradeEvent(packageName, version, previousVersion, time, {
        historical: true,
      });
    })
    .filter((e): e is UpgradeEvent => e != null);

  return upgradeEvents;
};

export default async function run(flags: PopulatePackageFlags) {
  if (!flags.pkg.startsWith('@atlaskit/')) {
    throw new Error(`Package must start with '@atlaskit/'`);
  }
  const packageInfo = await getPackageInfo(flags.pkg);

  const analyticsEvents = createAnalyticsEvents(flags.pkg, packageInfo);

  if (flags.dryRun) {
    console.log(JSON.stringify(analyticsEvents));
    return;
  }

  await sendAnalytics(analyticsEvents, {
    dev: flags.dev,
    limit: flags.limit,
    product: 'atlaskit',
  });

  console.log('Done.');
}
