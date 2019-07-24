import { ReleaseType } from 'semver';

export type DependencyType =
  | 'devDependency'
  | 'dependency'
  | 'optionalDependency'
  | 'peerDependency';
export type UpgradeType = 'add' | 'upgrade' | 'remove' | 'downgrade';
export type UpgradeSubType = ReleaseType | null;

// go/dataportal/analytics/registry/17058
export type UpgradeEvent = {
  dependencyName: string;
  versionString: string;
  major: string | null;
  minor: string | null;
  patch: string | null;
  date: string;
  upgradeType: UpgradeType;
  upgradeSubType: UpgradeSubType;
  cliVersion: string;
  dependencyType?: DependencyType;
  historical?: boolean;
  commitHash?: string;
};
