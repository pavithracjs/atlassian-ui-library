import duplicateDependenciesReport from './reports/duplicate-dependencies/duplicate-dependencies-report';
import envWithGuard from './util/env-with-guard';

const sourceBranch = envWithGuard('SOURCE_BRANCH');
const commit = envWithGuard('COMMIT');
const token = envWithGuard('BITBUCKET_TOKEN');
const gitUrl = envWithGuard('REPO_GIT_URL');

export default function() {
  return duplicateDependenciesReport(sourceBranch, gitUrl, token, commit).catch(
    err => {
      // catch errors but don't fail the build
      console.error(`Failed to publish duplicate dependencies report`);
      console.error(err);
    },
  );
}

// TODO: CLI
// import chalk from 'chalk';
// import * as meow from 'meow';

// // prettier-ignore
// const HELP_MSG = `
// ${chalk.yellow.bold('[update]')}
//    Updates a list of given packages to latest version.

//    ${chalk.green('Options')}
//      ${chalk.yellow('--exclude')}     Comma separated list of packages to exclude from update
//      ${chalk.yellow('--force')}       Forces update even when all provided packages are up-to-date

//    ${chalk.green('Examples')}
//      ${chalk.dim('$ akup update @atlaskit/editor-core')}
//      ${chalk.dim('$ akup update @atlaskit/editor-core @atlaskit/renderer --exclude @atlaskit/analytics-next,@atlaskit/media-card')}

// ${chalk.yellow.bold('[changelog]')}
//    Shows a changelog for a given package from current version to latest.

//    ${chalk.green('Examples')}
//      ${chalk.dim('$ akup changelog @atlaskit/editor-core')}
// `;

// export function run() {
//   const cli = meow(HELP_MSG);
//   const [command, ...inputs] = cli.input;

//   if (command === 'update') {
//     return updateCommand(inputs, {
//       exclude: (cli.flags.exclude || '').split(','),
//       force: cli.flags.force,
//       preset: cli.flags.preset,
//     } as UpdateTaskFlags);
//   }

//   if (command === 'changelog') {
//     return changelogCommand(inputs[0], inputs[1]);
//   }

//   // tslint:disable:no-console
//   return Promise.resolve(console.log(cli.help));
// }
