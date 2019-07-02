export type AnalyticsEvent = {
  dependencyName: string;
  dependencyType?:
    | 'devDependency'
    | 'dependency'
    | 'optionalDependency'
    | 'peerDependency';
  versionString: string;
  major: number;
  minor: number;
  patch: number;
  date: string;
  product: string;
};
