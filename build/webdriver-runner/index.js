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
  // we don't check result.success as this is false when there are obsolete
  // snapshots, which can legitimately happen with Webdriver tests on CI
  // as they are only run on Chrome in the Landkid build
  if (
    !result ||
    (result.numFailedTestSuites === 0 && result.numFailedTests === 0)
  ) {
    return 0;
  }
  return 1;
}

function isSnapshotAddedFailure(testResult /*: any */) /*: boolean*/ {
  if (!testResult.failureMessage) {
    return false;
  }
  // When updating Jest, check that this message is still correct
  return testResult.failureMessage.indexOf('New snapshot was not written') > -1;
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
      ci: process.env.CI,
    },
    [process.cwd()],
  );

  return status.results;
}

async function rerunFailedTests(results) {
  const { testResults } = results;
  if (!testResults) {
    return results;
  }

  const failingTestPaths = testResults
    // If a test **suite** fails (where no tests are executed), we should check to see if
    // failureMessage is truthy, as no tests have actually run in this scenario.
    // If a test suite has failed because only because snapshots were added
    // there is no point in re-running the tests as we know they will fail.
    .filter(testResult => {
      return (
        (testResult.numFailingTests > 0 ||
          (testResult.failureMessage && results.numFailedTestSuites > 0)) &&
        !isSnapshotAddedFailure(testResult)
      );
    })
    .map(testResult => testResult.testFilePath);

  if (!failingTestPaths.length) {
    return results;
  }

  console.log(
    `Re-running ${
      failingTestPaths.length
    } test suites.\n${failingTestPaths.join('\n')}`,
  );

  // We don't want to clobber the original results
  // Now we'll upload two test result files.
  process.env.JEST_JUNIT_OUTPUT = path.join(
    process.cwd(),
    'test-reports/junit-rerun.xml',
  );
  return runJest(failingTestPaths);
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

      // Only retry and report results in CI.
      if (code !== 0 && process.env.CI) {
        let snapshotsAdded = false;
        if (results.testResults) {
          snapshotsAdded =
            results.testResults.filter(testResult =>
              isSnapshotAddedFailure(testResult),
            ).length > 0;
        }
        results = await rerunFailedTests(results);

        code = snapshotsAdded ? 1 : getExitCode(results);

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
