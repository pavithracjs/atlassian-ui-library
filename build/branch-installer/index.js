#!/usr/bin/env node
const log = console.log;
const meow = require('meow');
const chalk = require('chalk');
const installFromCommit = require('./src/install-from-commit');

let cli = meow(
  `
    Usage
        $ atlaskit-branch-installer commitHash
      Options
        --engine Which engine to use (bolt/yarn) [Default: yarn]
        --cmd Command to run to install packages (add/upgrade) [Default: add]
        --dry-run Do not install the packages just print it
        --verbose Show what is going on

        [Advanced]
        --packages Comma separated list of packages to install from commit [Default: all]
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
        default: 'add',
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

// Validate all the flags
let flagsAllValid = true;
const commitHash = cli.input[0].substr(0, 12);
const error = message => console.log(chalk.red(`Error: ${message}`));

if (!commitHash || commitHash.length !== 12) {
  error('Commit hash is required and must be at least 12 characters');
  flagsAllValid = false;
}
if (!['yarn', 'bolt'].includes(cli.flags.engine)) {
  error('--engine flag must be one of [yarn, bolt]');
  flagsAllValid = false;
}
if (!['add', 'upgrade'].includes(cli.flags.cmd)) {
  error('--cmd flag must be one of [add, upgrade]');
  flagsAllValid = false;
}

if (flagsAllValid) {
  installFromCommit(commitHash, cli.flags);
} else {
  cli.showHelp();
}
