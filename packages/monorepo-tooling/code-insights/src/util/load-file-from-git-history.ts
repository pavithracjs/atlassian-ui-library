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

      resolve(stdout.toString().replace(/\n$/gi, ''));
    });
  });
}

function getAncestorCommit(
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

        resolve(stdout.toString().replace(/\n$/gi, ''));
      },
    );
  });
}

function getFileFromGitHistory(
  ancestorCommit: string,
  fileName: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
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

// Lock files tend to be huge
const FiveMBBuffer = 1024 * 5000;

export default async function loadFileFromGitHistory(
  branchName: string,
  fileName: string,
): Promise<string> {
  const currentBranch = await getCurrentBranch();
  const ancestorCommit = await getAncestorCommit(branchName, currentBranch);

  return getFileFromGitHistory(ancestorCommit, fileName);
}
