import { exec, execSync } from 'child_process';

// Lock files tend to be huge
const FiveMBBuffer = 1024 * 5000;

export default function loadFileFromGitHistory(
  branchName: string,
  fileName: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentBranch = execSync(
      `git rev-parse --abbrev-ref HEAD`,
    ).toString();
    const ancestorCommit = execSync(
      `git merge-base ${branchName} ${currentBranch}`,
    )
      .toString()
      .replace(/(\r\n|\n|\r)/gm, '');
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
