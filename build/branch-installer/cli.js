#!/usr/bin/env node
const log = console.log;
const meow = require('meow');
const chalk = require('chalk');
const {
  _installFromCommit,
  validateOptions,
} = require('./src/install-from-commit');

let cli = meow(
  `
    Usage
        $ atlaskit-branch-installer commitHash
      Options
        --engine Which engine to use (bolt/yarn) [Default: yarn]
        --cmd Command to run to install packages (add/upgrade) [Default: upgrade]
        --dry-run Do not install the packages just print it
        --verbose Show what is going on

        [Advanced]
        --packages Comma separated list of packages to install from commit. All meaning all that are installed in the target package.json [Default: all]
        --timeout Maximum time to wait (in ms) for a manifest to be published for a commit [Default: 20000]
        --interval How long to wait (in ms) between retries when looking for packages manifest [Default: 5000]

      Examples
        $ yarn atlaskit-branch-installer 6ce63f22816e --verbose
        $ yarn atlaskit-branch-installer 6ce63f22816e --packages=@atlaskit/avatar,@atlaskit/editor-core
        $ yarn atlaskit-branch-installer 6ce63f22816e --timeout=180000 --interval=10000 --engine=bolt --cmd=upgrade
`,
  {
    flags: {
      engine: {
        type: 'string',
        default: 'yarn',
      },
      cmd: {
        type: 'string',
        default: 'upgrade',
      },
      dryRun: {
        type: 'boolean',
        default: false,
      },
      verbose: {
        type: 'boolean',
        alias: 'v',
        default: false,
      },
      packages: {
        type: 'string',
        default: 'all',
      },
      timeout: {
        type: 'number',
        default: 20000,
      },
      interval: {
        type: 'number',
        default: 5000,
      },
    },
  },
);

const input = cli.input[0] || '';
const commitHash = input.substr(0, 12);

const errors = validateOptions(commitHash, { ...cli.flags });

if (errors.length === 0) {
  _installFromCommit(commitHash, cli.flags).catch(e => process.exit(1));
} else {
  console.error(chalk.red(errors.join('\n')));
  cli.showHelp();
  process.exit(1);
}
