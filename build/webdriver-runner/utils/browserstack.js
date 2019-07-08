//@flow

/*
 * util module to support connect and disconnect from browserstack.
 */

const browserstack = require('browserstack-local');
const ora = require('ora');
const chalk = require('chalk');

const bsLocal = new browserstack.Local();

const uniqIdentifierStamp = process.env.LOCAL_IDENTIFIER || '';
const bsKey = process.env.BROWSERSTACK_KEY;
const commit = process.env.BITBUCKET_COMMIT
  ? process.env.BITBUCKET_COMMIT + uniqIdentifierStamp
  : process.env.USER
  ? process.env.USER + uniqIdentifierStamp
  : uniqIdentifierStamp;

async function startServer() {
  const spinner = ora(chalk.cyan('Connecting to BrowserStack')).start();
  return new Promise((resolve, reject) => {
    bsLocal.start({ key: bsKey, localIdentifier: commit }, error => {
      if (error) {
        spinner.fail(chalk.red('Failed to connect to BrowserStack:', error));
        return reject(error);
      }
      if (commit) {
        spinner.succeed(
          chalk.cyan(`Connected to BrowserStack with identifier: ${commit}`),
        );
      }
      resolve();
    });
  });
}

function stopServer() {
  console.log('Disconnecting from BrowserStack');
  bsLocal.stop(() => {});
}

module.exports = { startServer, stopServer };
