import duplicateDependenciesReport from './reports/duplicate-dependencies/duplicate-dependencies-report';
import chalk from 'chalk';
import meow from 'meow';
import consoleReporter from './reporters/console';
import { GitReporter } from './reporters/git-reporter';
import BitbucketServerReporter from './reporters/bitbucket-server';
import { getRef, getOriginUrl } from './util/git';
import { InsightsReporter } from './reporters/insights-reporter';

type Flags = {
  commit: string;
  branch: string;
  targetBranch: string;
  gitUrl: string;
  reporters: string;
};

const getTargetBranch = async (
  flags: Flags,
  gitReporter?: GitReporter,
): Promise<string> => {
  if (gitReporter) {
    return (
      (await gitReporter.getTargetBranch(flags.branch)) || flags.targetBranch
    );
  }

  return flags.targetBranch;
};

// prettier-ignore
const HELP_MSG = `
   Reports insights

   ${chalk.green('Options')}
     ${chalk.yellow('--commit')}       The commit to publish insights on [default=current head]
     ${chalk.yellow('--reporters')}    The reporters to run [default=console]
     ${chalk.yellow('--gitUrl')}       The git url of the repo [default=current origin url]
     ${chalk.yellow('--targetBranch')} The branch with which to compare the current branch, when git reporting is enabled can detect PR target branch. [default=master]

   ${chalk.green('Reporters')}
    ${chalk.yellow('console')}        outputs insights to the console
    ${chalk.yellow('bbs')}            outputs insights to the bitbucket-server code insights tool. Requires BITBUCKET_SERVER_TOKEN env variable
`;

const getGitUrl = async (gitUrl?: string): Promise<string> => {
  if (gitUrl) {
    return gitUrl;
  }
  return getOriginUrl();
};

const getCommit = async (commit?: string): Promise<string> => {
  if (commit) {
    return commit;
  }
  return getRef();
};

export async function run() {
  const cli = meow(HELP_MSG, {
    flags: {
      commit: {
        type: 'string',
      },
      branch: {
        type: 'string',
      },
      targetBranch: {
        type: 'string',
        default: 'origin/master',
      },
      gitUrl: {
        type: 'string',
      },
      reporters: {
        type: 'string',
        default: 'console',
      },
    },
  });

  const selectedReporters = cli.flags.reporters.split(',');
  const reporters: InsightsReporter[] = [];
  const [gitUrl, commit] = await Promise.all([
    getGitUrl(cli.flags.gitUrl),
    getCommit(cli.flags.commit),
  ]);

  let bitbucketServerReporter;

  if (selectedReporters.includes('bbs')) {
    bitbucketServerReporter = new BitbucketServerReporter(gitUrl, commit);
    reporters.push(bitbucketServerReporter);
  }

  if (selectedReporters.includes('console')) {
    reporters.push(new consoleReporter());
  }

  const targetBranch = await getTargetBranch(
    cli.flags as Flags,
    bitbucketServerReporter,
  );

  const duplicatesReport = await duplicateDependenciesReport(targetBranch);
  for (const reporter in reporters) {
    try {
      await reporters[reporter].publishInsightsReport(duplicatesReport);
    } catch (err) {
      console.error(
        chalk.red(
          `Failed to use reporter ${chalk.bold(reporters[reporter].name)}`,
        ),
      );
      console.error(err);
    }
  }
}
