import { DependencyType } from '../../types';

export type PopulateHistoricDataFlags = {
  dev: boolean;
  dryRun: boolean;
  limit?: number;
  interactive: boolean;
};

export type DependencyMap = {
  [name: string]: {
    version: string;
    type: DependencyType;
  };
};

export type AkPackageChange = {
  akDeps: DependencyMap;
  date: string;
};
