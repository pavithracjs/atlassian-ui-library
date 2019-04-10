'use strict';
// @flow

/*
 * Setup webdriver clients depending on environment on which the test is run against.
 * BrowserTestCase is customized wrapper over jest-test-runner handling test setup, execution and
 * teardown for webdriver tests .
 */

// increase default jasmine timeout not to fail on webdriver tests as tests run can
// take a while depending on the number of threads executing.

// increase this time out to handle queuing on browserstack
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200e3;
const isBrowserStack = process.env.TEST_ENV === 'browserstack';
const setupClients = require('./utils/setupClients');
const path = require('path');
const Queue = require('promise-queue');

let clients /*: Array<?Object>*/ = [];

if (isBrowserStack) {
  clients = setupClients.setBrowserStackClients();
} else {
  clients = setupClients.setLocalClients();
}

const launchClient = client => {
  if (
    client &&
    (client.driver.requestHandler && client.driver.requestHandler.sessionID)
  ) {
    return;
  }

  client.driver.desiredCapabilities.name = filename;
  client.queue = new Queue(1, 100);
  return client.driver.init();
};

const endSession = client => {
  if (!client || !client.driver) {
    return Promise.resolve();
  }

  return client.driver.end();
};

const filename = path.basename(module.parent.filename);

const launchedDrivers = {};
const launchedClients = [];

afterAll(async function() {
  await Promise.all(launchedClients.map(endSession));
});

/*::
 type Tester<Object> = (client: any, testCase: string) => ?Promise<mixed>;
*/
function BrowserTestCase(
  testCase /*: string */,
  options /*: {skip?: string[]} */,
  tester /*: Tester<Object> */,
) {
  let testsToRun = [];
  let skip = [];
  if (options && options.skip) {
    skip = Array.isArray(options.skip) ? options.skip : [];
  }

  const execClients = clients.filter(
    c => c && c.browserName && !skip.includes(c.browserName.toLowerCase()),
  );

  describe(filename, () => {
    if (!execClients.length) {
      test.skip(testCase, () => {});
      return;
    }

    for (let c of execClients) {
      const client = c || {};
      const testCode = () => tester(client.driver, testCase);
      if (!launchedDrivers[client.browserName]) {
        launchedDrivers[client.browserName] = launchClient(client);
        launchedClients.push(client);
      }

      describe(client.browserName, () => {
        test.concurrent(testCase, async () => {
          // We need to wait for the driver be
          // ready to start
          await launchedDrivers[client.browserName];

          // This will make sure that we will run
          // only on test case per time on
          // the same browser
          return client.queue.add(testCode);
        });
      });
    }
  });
}

expect.extend({
  toMatchDocSnapshot() {
    throw new Error('Please use toMatchCustomDocSnapshot on integration tests');
  },

  toMatchSnapshot() {
    throw new Error('Please use toMatchCustomSnapshot on integration tests');
  },
});

module.exports = { BrowserTestCase };
