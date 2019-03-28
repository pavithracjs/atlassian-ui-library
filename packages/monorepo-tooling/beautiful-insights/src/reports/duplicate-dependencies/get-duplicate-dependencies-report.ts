import { IPackageJSON } from '../../util/package-json';

import { ParseResult, parse as lockFileParse } from '@yarnpkg/lockfile';
import fs from 'fs';
import path from 'path';

const defaultPackageJSONResolver = (): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), './package.json'),
      'utf8',
      (readErr, source) => {
        if (readErr) {
          console.error(readErr);
          reject(readErr);
          return;
        }

        resolve(source);
      },
    );
  });

const defaultYarnLockResolver = (): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), './yarn.lock'),
      'utf8',
      (readErr, source) => {
        if (readErr) {
          console.error(readErr);
          reject(readErr);
          return;
        }

        resolve(source);
      },
    );
  });

export type DuplicateDependencyReportEntry = {
  name: string;
  versions: string[];
  isDevDependency: boolean;
  directVersion: string;
};

export type DuplicatesReport = DuplicateDependencyReportEntry[];

type ReportMapEntry = Set<string>;
type PackageName = string;

function getReportMap(
  parsedYarnLock: ParseResult,
): Map<PackageName, ReportMapEntry> {
  const reportMap = new Map<PackageName, ReportMapEntry>();

  Object.keys(parsedYarnLock.object).forEach(key => {
    const name = key.substring(0, key.lastIndexOf('@'));
    const { version } = parsedYarnLock.object[key];
    const currentVersions = reportMap.get(name);

    if (currentVersions) {
      currentVersions.add(version);
    } else {
      reportMap.set(name, new Set<string>([version]));
    }
  });

  return reportMap;
}

export default async ({
  returnAllDependencyCounts = false,
  packageJSONResolver = defaultPackageJSONResolver,
  yarnLockResolver = defaultYarnLockResolver,
} = {}): Promise<DuplicatesReport> => {
  const packageJSON: IPackageJSON = JSON.parse(await packageJSONResolver());

  const yarnLock = await yarnLockResolver();

  const parsedYarnLock = lockFileParse(yarnLock);

  const reportMap = getReportMap(parsedYarnLock);

  const { dependencies = {}, devDependencies = {} } = packageJSON;

  let report = Array.from(reportMap.entries()).map(([name, versionsSet]) => ({
    name,
    versions: Array.from(versionsSet),
    directVersion: dependencies[name] || devDependencies[name],
    isDevDependency: !dependencies[name] && !!devDependencies[name],
  }));

  if (!returnAllDependencyCounts) {
    report = report.filter(({ versions }) => versions.length > 1);
  }

  return report;
};
