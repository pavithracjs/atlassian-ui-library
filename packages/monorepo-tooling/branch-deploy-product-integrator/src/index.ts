import chalk from 'chalk';
import meow from 'meow';
import simpleGit from 'simple-git/promise';

//@ts-ignore
import installFromCommit from '@atlaskit/branch-installer';

// type Flags = {

// };
// prettier-ignore
const HELP_MSG = `
   Reports insights

   ${chalk.green('Options')}
     ${chalk.yellow('--branchPrefix')} Prefix for the generated branch [default=atlaskit-branch-deploy/]
     ${chalk.yellow('--workingPath')}  Working path of the product repo installing a branch in [default=./]
     ${chalk.yellow('--atlaskitCommitHash')} Atlaskit commit hash
     ${chalk.yellow('--atlaskitBranchName')} The branch of Atlaskit we're integrating
     ${chalk.yellow('--packageEngine')} Bolt or yarn
     ${chalk.yellow('--packages')} comma delimited list of packages to install branch deploy of

   ${chalk.green('Reporters')}
    ${chalk.yellow('console')}        outputs insights to the console
    ${chalk.yellow('bbs')}            outputs insights to the bitbucket-server code insights tool. Requires BITBUCKET_SERVER_TOKEN env variable
`;

// const getGitUrl = async (gitUrl?: string): Promise<string> => {
//   if (gitUrl) {
//     return gitUrl;
//   }
//   return getOriginUrl();
// };

// const getCommit = async (commit?: string): Promise<string> => {
//   if (commit) {
//     return commit;
//   }
//   return getRef();
// };

export async function run() {
  const cli = meow(HELP_MSG, {
    flags: {
      branchPrefix: {
        type: 'string',
        default: 'atlaskit-branch-deploy/',
      },
      workingPath: {
        type: 'string',
        default: './',
      },
      atlaskitBranchName: {
        type: 'string',
      },
      packageEngine: {
        type: 'string',
        default: 'yarn',
      },
      atlaskitCommitHash: {
        type: 'string',
      },
      packages: {
        type: 'string',
      },
    },
  });

  const git = simpleGit(cli.flags.workingPath);
  const branchName = `${cli.flags.branchPrefix}${cli.flags.atlaskitBranchName}`;

  const remote = await git.listRemote(['--get-url']);

  if (remote.indexOf('atlassian/atlaskit-mk-2') > -1) {
    throw new Error('Working path should not be the Atlaskit repo!');
  }
  let branchExists;

  try {
    await git.revparse(['--verify', branchName]);
    branchExists = true;
  } catch (error) {
    branchExists = false;
  }

  if (branchExists) {
    await git.checkout(branchName);
  } else {
    await git.checkoutBranch(branchName, 'origin/master');
  }

  await installFromCommit(cli.flags.atlaskitCommitHash, {
    engine: 'bolt',
    cmd: 'upgrade',
    packages: cli.flags.packages,
  });

  await git.add(['./']);

  // prettier-ignore
  const commitMessage = `Upgraded to Atlaskit changes on branch ${cli.flags.atlaskitBranchName}

https://bitbucket.org/atlassian/atlaskit-mk-2/branch/${cli.flags.atlaskitBranchName}
  `;

  await git.commit(commitMessage);
  await git.push('origin', branchName);
}
