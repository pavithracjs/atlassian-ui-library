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

const launchClient = async client => {
  if (
    client &&
    (client.isReady ||
      (client.driver.requestHandler && client.driver.requestHandler.sessionID))
  ) {
    return;
  }

  client.queue = new Queue(1, 100);
  return client.driver.init().then(() => {
    client.isReady = true;
  });
};

const endSession = async client => {
  if (client && client.isReady) {
    client.isReady = false;
    await client.driver.end();
  }
};

const filename = path.basename(module.parent.filename);

const initDrivers = () => {
  const c = {};

  for (const client of clients) {
    if (!client) {
      continue;
    }

    client.driver.desiredCapabilities.name = filename;
    c[client.browserName] = launchClient(client);
  }

  return c;
};

// We need to init all driver on load this file
const drivers = initDrivers();

afterAll(async function() {
  await Promise.all(clients.map(endSession));
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
    for (let c of execClients) {
      const client = c || {};
      const testCode = () => tester(client.driver, testCase);

      describe(client.browserName, () => {
        test.concurrent(testCase, async () => {
          // We need to wait for the driver be
          // ready to start
          await drivers[client.browserName];

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
