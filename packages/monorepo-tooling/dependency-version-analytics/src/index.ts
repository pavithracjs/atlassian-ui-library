/// <reference lib="es2017.object" />

import chalk from 'chalk';
import meow from 'meow';
import populateProduct from './commands/populate-historic-data/product';

// prettier-ignore
const HELP_MSG = `
${chalk.yellow.bold('[send-product]')}
   Sends analytics event for the current package.json

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics send-product')}

${chalk.yellow.bold('[populate-product]')}
   ${chalk.green('Options')}
     ${chalk.yellow('--dryRun')}      Prints analytics events to console

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-product')}
`;

type Cli = meow.Result & {
  flags: {
    csv: boolean;
    dryRun: boolean;
  };
};

export function run() {
  const cli = meow(HELP_MSG, {
    flags: {
      csv: {
        type: 'boolean',
      },
      dryRun: {
        type: 'boolean',
        alias: 'd',
      },
    },
  }) as Cli;

  const [command /*, ...inputs*/] = cli.input;

  if (command === 'populate-product') {
    return populateProduct({
      csv: cli.flags.csv,
      dryRun: cli.flags.dryRun,
    });
  }

  /* eslint-disable no-console */
  return Promise.resolve(console.log(cli.help));
}
