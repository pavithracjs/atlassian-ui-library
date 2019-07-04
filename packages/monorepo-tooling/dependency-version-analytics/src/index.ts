/// <reference lib="es2017.object" />

import chalk from 'chalk';
import meow from 'meow';
import populateProduct from './commands/populate-historic-data/product';

// prettier-ignore
const HELP_MSG = `
${chalk.yellow.bold('[send-product] <product>')}
   Sends analytics event for the current package.json

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics send-product jira')}

${chalk.yellow.bold('[populate-product] <product>')}
   Finds historical atlaskit dependency changes to package.json over time and sends analytics for them
   ${chalk.green('Options')}
     ${chalk.yellow('--csv')}         Prints AK dependency history in CSV format
     ${chalk.yellow('--dev')}         Send analytics to dev analytics pipeline instead of prod
     ${chalk.yellow('--dryRun')}      Performs a dry run, prints analytics events to console in JSON format instead of sending them

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-product jira')}
`;

type Cli = meow.Result & {
  flags: {
    csv: boolean;
    dev: boolean;
    dryRun: boolean;
  };
};

export function run({ dev }: { dev: boolean }) {
  const cli = meow(HELP_MSG, {
    flags: {
      csv: {
        type: 'boolean',
      },
      dev: {
        type: 'boolean',
      },
      dryRun: {
        type: 'boolean',
        alias: 'd',
      },
    },
  }) as Cli;

  const [command, ...inputs] = cli.input;

  if (command === 'populate-product') {
    const product = inputs[0];
    if (!product) {
      console.error(chalk.red('Must pass a product parameter'));
      process.exit(1);
    }
    return populateProduct({
      csv: cli.flags.csv,
      dev: dev || cli.flags.dev,
      dryRun: cli.flags.dryRun,
      product,
    });
  }

  /* eslint-disable no-console */
  return Promise.resolve(console.log(cli.help));
}
