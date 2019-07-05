import { exec } from 'child_process';
import { IPackageJSON } from './package-json';

export type PackageData = IPackageJSON & {
  directories: {};
  dist: {};
  'dist-tags': {
    [tag: string]: string;
  };
  versions: string[];
  time: {
    [version: string]: string;
  };
};

export type PackageInfo = {
  type: string;
  data: PackageData;
};

export default function getPackageInfo(
  packageName: string,
): Promise<PackageInfo> {
  return new Promise((resolve, reject) => {
    exec(`yarn info ${packageName} --json`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      let json;

      try {
        json = JSON.parse(stdout);
      } catch (e) {
        reject(`Error parsing json output: ${e}`);
      }

      resolve(json);
    });
  });
}
