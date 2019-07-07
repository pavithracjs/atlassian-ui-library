import { ReleaseType } from 'semver';

export type DependencyType =
  | 'devDependency'
  | 'dependency'
  | 'optionalDependency'
  | 'peerDependency';
export type UpgradeType = 'add' | 'upgrade' | 'remove';
export type UpgradeSubType = ReleaseType | null;

export type UpgradeEvent = {
  dependencyName: string;
  versionString: string;
  major: string | null;
  minor: string | null;
  patch: string | null;
  date: string;
  upgradeType: UpgradeType;
  upgradeSubType: UpgradeSubType;
  dependencyType?: DependencyType;
  historical?: boolean;
  commitHash?: string;
};
