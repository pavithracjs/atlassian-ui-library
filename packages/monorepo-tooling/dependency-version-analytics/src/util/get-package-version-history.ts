import { exec } from 'child_process';

export type PackageVersionHistory = {
  [version: string]: string;
};

export default function getPackageVersionHistory(
  packageName: string,
): Promise<PackageVersionHistory> {
  return new Promise((resolve, reject) => {
    exec(`yarn info ${packageName} --json time`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      let json;

      try {
        json = JSON.parse(stdout).data;
      } catch (e) {
        reject(`Error parsing json output: ${e}`);
      }

      resolve(json);
    });
  });
}
