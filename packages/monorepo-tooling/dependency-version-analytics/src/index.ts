/// <reference lib="es2017.object" />

import chalk from 'chalk';
import meow from 'meow';
import populateProduct from './commands/populate-historic-data/product';
import populatePackage from './commands/populate-historic-data/package';

// prettier-ignore
const HELP_MSG = `
${chalk.yellow.bold('[send-product] <product>')}
   Sends analytics event for the current package.json

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics send-product jira')}

${chalk.yellow.bold('[populate-product] <product>')}
   Sends analytics events for historical atlaskit dependency version changes in package.json over time.
   Should only be run once.
   ${chalk.green('Options')}
     ${chalk.yellow('--csv')}         Prints AK dependency history in CSV format
     ${chalk.yellow('--dev')}         Send analytics to dev analytics pipeline instead of prod
     ${chalk.yellow('--dryRun')}      Performs a dry run, prints analytics events to console in JSON format instead of sending them

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-product jira')}

${chalk.yellow.bold('[populate-package] <package>')}
   Sends analytics events for all published versions of package.
   Should only be run once.
   ${chalk.green('Options')}
     ${chalk.yellow('--dev')}         Send analytics to dev analytics pipeline instead of prod
     ${chalk.yellow('--dryRun')}      Performs a dry run, prints analytics events to console in JSON format instead of sending them

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-package @atlaskit/button')}
`;

type Cli = meow.Result & {
  flags: {
    csv: boolean;
    dev: boolean;
    dryRun: boolean;
    limit?: number;
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
      limit: {
        type: 'string',
      },
    },
  }) as Cli;

  const [command, ...inputs] = cli.input;

  const limit = cli.flags.limit != null ? +cli.flags.limit : undefined;

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
      limit,
      product,
    });
  } else if (command === 'populate-package') {
    const pkg = inputs[0];
    if (!pkg) {
      console.error(chalk.red('Must pass a package parameter'));
      process.exit(1);
    }
    return populatePackage({
      dev: dev || cli.flags.dev,
      dryRun: cli.flags.dryRun,
      limit,
      pkg,
    });
  }

  /* eslint-disable no-console */
  return Promise.resolve(console.log(cli.help));
}
