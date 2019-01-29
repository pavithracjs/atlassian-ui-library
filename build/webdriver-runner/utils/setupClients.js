'use strict';
// @flow
const webdriverio = require('webdriverio');
const uniqIdentifierStamp = process.env.LOCAL_IDENTIFIER || '';
const commit = process.env.BITBUCKET_COMMIT
  ? process.env.BITBUCKET_COMMIT + uniqIdentifierStamp
  : process.env.USER
  ? process.env.USER + uniqIdentifierStamp
  : uniqIdentifierStamp;

if (!process.env.BITBUCKET_BRANCH && process.env.USER) {
  process.env.BITBUCKET_BRANCH = process.env.USER + '_local_run';
}

function setBrowserStackClients() /*: Array<?Object>*/ {
  let launchers = {
    chrome: {
      os: 'Windows',
      os_version: '10',
      browserName: 'chrome',
      browser_version: '71.0',
      resolution: '1440x900',
    },
    firefox: {
      os: 'Windows',
      os_version: '10',
      browserName: 'firefox',
      browser_version: '64.0',
      resolution: '1440x900',
    },
    ie: {
      os: 'Windows',
      os_version: '10',
      browserName: 'ie',
      browser_version: '11',
      resolution: '1440x900',
    },
    safari: {
      os: 'OS X',
      os_version: 'Mojave',
      browserName: 'safari',
      browser_version: '12.0',
      resolution: '1920x1080',
    },
    // @see https://github.com/webdriverio/webdriverio/issues/3324
    // edge: {
    //   os: 'Windows',
    //   os_version: '10',
    //   browserName: 'edge',
    //   browser_version: '18',
    //   resolution: '1440x900',
    // },
  };
  if (process.env.LANDKID) {
    delete launchers.safari;
    delete launchers.ie;
    delete launchers.firefox;
    delete launchers.edge;
    process.env.BITBUCKET_BRANCH = 'Landkid';
  }
  const launchKeys = Object.keys(launchers);
  const options = launchKeys.map(launchKey => {
    const option = {
      capabilities: {
        os: launchers[launchKey].os,
        os_version: launchers[launchKey].os_version,
        browserName: launchers[launchKey].browserName,
        browser_version: launchers[launchKey].browser_version,
        project: 'Atlaskit Webdriver Tests',
        build: process.env.BITBUCKET_BRANCH,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.idleTimeout': 300,
        'browserstack.localIdentifier': commit,
      },
      host: 'hub.browserstack.com',
      port: 80,
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_KEY,
      waitforTimeout: 3000,
      logLevel: 'warn',
    };

    return { driverOptions: option };
  });

  return options;
}

function setLocalClients() /*: Array<?Object>*/ {
  const port = require('./chromeDriver').port;
  let isHeadless = process.env.HEADLESS !== 'false';
  // Keep only chrome for watch mode
  if (process.env.WATCH === 'true') isHeadless === 'false';
  const options = {
    port,
    capabilities: {
      browserName: 'chrome',
      chromeOptions: isHeadless ? { args: ['--headless'] } : { args: [] },
    },
  };

  return [{ driverOptions: options }];
}

module.exports = { setLocalClients, setBrowserStackClients };
