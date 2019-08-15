import { exec } from 'child_process';

function getCurrentBranch(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`git rev-parse --abbrev-ref HEAD`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout.toString());
    });
  });
}

function getancestorCommit(
  branchName: string,
  currentBranch: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `git merge-base ${branchName} ${currentBranch}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        if (stderr) {
          reject(stderr);
        }

        resolve(stdout.toString().replace(/\n$/, ''));
      },
    );
  });
}

// Lock files tend to be huge
const FiveMBBuffer = 1024 * 5000;

export default function loadFileFromGitHistory(
  branchName: string,
  fileName: string,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const currentBranch = await getCurrentBranch();
    const ancestorCommit = await getancestorCommit(branchName, currentBranch);
    exec(
      `git show ${ancestorCommit}:${fileName}`,
      { maxBuffer: FiveMBBuffer },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        if (stderr) {
          reject(stderr);
        }

        resolve(stdout);
      },
    );
  });
}
