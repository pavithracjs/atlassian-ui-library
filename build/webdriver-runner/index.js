// @flow
'use strict';

const path = require('path');
const isReachable = require('is-reachable');
const jest = require('jest');
const meow = require('meow');
const chalk = require('chalk');

const webpack = require('./utils/webpack');
const reporting = require('./reporting');

const LONG_RUNNING_TESTS_THRESHOLD_SECS = 60;

/*
 * function main() to
 * start and stop webpack-dev-server, selenium-standalone-server, browserstack connections
 * and run and wait for webdriver tests complete.
 *
 * By default the tests are running headlessly, set HEADLESS=false if you want to run them directly on real browsers.
 * if WATCH= true, by default, it will start chrome.
 */

process.env.NODE_ENV = 'test';
process.env.INTEGRATION_TESTS = 'true';

const isBrowserStack = process.env.TEST_ENV === 'browserstack';
const maxWorkers = isBrowserStack ? 5 : 1;

const cli = meow({
  flags: {
    updateSnapshot: {
      type: 'boolean',
      alias: 'u',
    },
  },
});

function getExitCode(result /*: any */) {
  return !result || result.success ? 0 : 1;
}

async function runJest(testPaths) {
  const status = await jest.runCLI(
    {
      _: testPaths || cli.input,
      maxWorkers,
      watch: !!process.env.WATCH,
      watchPathIgnorePatterns: [
        '\\/node_modules\\/',
        '.+\\/__tests__\\/(?!integration)',
        '.+\\/__tests-karma__\\/',
        '.+\\/__snapshots__\\/',
        '.+\\/__image_snapshots__\\/',
      ],
      passWithNoTests: true,
      updateSnapshot: cli.flags.updateSnapshot,
      // https://product-fabric.atlassian.net/browse/BUILDTOOLS-108
      // ci: process.env.CI,
    },
    [process.cwd()],
  );

  return status.results;
}

async function rerunFailedTests(result) {
  const failingTestPaths = result.testResults
    // If a test **suite** fails (where no tests are executed), we should check to see if
    // failureMessage is truthy, as no tests have actually run in this scenario.
    .filter(
      testResult =>
        testResult.numFailingTests > 0 ||
        (testResult.failureMessage && result.numFailedTestSuites > 0),
    )
    .map(testResult => testResult.testFilePath);

  if (!failingTestPaths.length) {
    return getExitCode(result);
  }

  console.log(
    `Re-running ${
      result.numFailedTestSuites
    } test suites.\n${failingTestPaths.join('\n')}`,
  );

  // We don't want to clobber the original results
  // Now we'll upload two test result files.
  process.env.JEST_JUNIT_OUTPUT = path.join(
    process.cwd(),
    'test-reports/junit-rerun.xml',
  );
  const results = await runJest(failingTestPaths);
  return results;
}

function runTestsWithRetry() {
  return new Promise(async resolve => {
    let results;
    let code = 0;
    try {
      results = await runJest();
      const perfStats = results.testResults
        .filter(result => {
          const timeTaken =
            (result.perfStats.end - result.perfStats.start) / 3600;
          return timeTaken > LONG_RUNNING_TESTS_THRESHOLD_SECS;
        })
        .map(result => {
          return {
            testFilePath: result.testFilePath.replace(process.cwd(), ''),
            timeTaken: +(
              (result.perfStats.end - result.perfStats.start) /
              3600
            ).toFixed(2),
          };
        });

      if (perfStats.length) {
        await reporting.reportLongRunningTests(
          perfStats,
          LONG_RUNNING_TESTS_THRESHOLD_SECS,
        );
      }

      code = getExitCode(results);
      console.log('initalTestExitStatus', code);
      // Only retry and report results in CI.
      // We have an additional check for `unchecked` snapshots
      // These refer to 'obsolete' snapshots. We should fail instead of retry if these exist
      // TODO: https://product-fabric.atlassian.net/browse/BUILDTOOLS-108
      if (code !== 0 && process.env.CI && results.snapshot.unchecked === 0) {
        results = await rerunFailedTests(results);

        code = getExitCode(results);
        /**
         * If the re-run succeeds,
         * log the previously failed tests to indicate flakiness
         */
        if (code === 0) {
          await reporting.reportInconsistency(results);
        } else {
          await reporting.reportFailure(
            results,
            'atlaskit.qa.integration_test.failure',
          );
        }
      }
    } catch (err) {
      console.error(err.toString());
      resolve(1);
      return;
    }

    resolve(code);
  });
}

function initClient() {
  /* To avoid load unnecessary libs and code
   * we require the clients only when it's necessary
   */
  if (isBrowserStack) {
    return require('./utils/browserstack');
  }

  return require('./utils/chromeDriver');
}

async function main() {
  const serverAlreadyRunning = await isReachable('http://localhost:9000');
  if (!serverAlreadyRunning) {
    await webpack.startDevServer();
  }

  let client = initClient();

  client
    .startServer()
    .then(async () => {
      const code = await runTestsWithRetry();

      console.log(`Exiting tests with exit code: ${+code}`);
      if (!serverAlreadyRunning) {
        webpack.stopDevServer();
      }

      client.stopServer();
      process.exit(code);
    })
    .catch(() => {
      console.log(chalk.red('Exiting as failed to start server'));
      process.exit(1);
    });
}

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
