'use strict';
// @flow
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
  const RESOLUTION = '1920x1080';
  let launchers = {
    chrome: {
      os: 'Windows',
      os_version: '10',
      browserName: 'chrome',
      browser_version: '76.0',
      resolution: RESOLUTION,
    },
    firefox: {
      os: 'Windows',
      os_version: '10',
      browserName: 'firefox',
      browser_version: '68.0',
      resolution: RESOLUTION,
    },
    ie: {
      os: 'Windows',
      os_version: '10',
      browserName: 'ie',
      browser_version: '11',
      resolution: RESOLUTION,
    },
    safari: {
      os: 'OS X',
      os_version: 'Mojave',
      browserName: 'Safari',
      browser_version: '12.1',
      resolution: RESOLUTION,
    },
    // https://github.com/webdriverio/webdriverio/issues/3196
    // edge: {
    //   os: 'Windows',
    //   os_version: '10',
    //   browserName: 'edge',
    //   browser_version: '17',
    //   resolution: RESOLUTION,
    // },
  };
  if (process.env.LANDKID) {
    delete launchers.safari;
    delete launchers.ie;
    delete launchers.firefox;
    // delete launchers.edge;
    process.env.BITBUCKET_BRANCH = 'Landkid';
  }
  const launchKeys = Object.keys(launchers);
  const clients = launchKeys.map(launchKey => {
    const options = {
      capabilities: {
        os: launchers[launchKey].os,
        os_version: launchers[launchKey].os_version,
        browserName: launchers[launchKey].browserName,
        browserVersion: launchers[launchKey].browser_version,
        project: 'Atlaskit Webdriver Tests',
        build: process.env.BITBUCKET_BRANCH,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.idleTimeout': 300,
        'browserstack.localIdentifier': commit,
        resolution: launchers[launchKey].resolution,
        acceptSslCerts: true,
      },
      logLevel: 'error',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_KEY,
      waitforTimeout: 3000,
    };
    return {
      browserName: launchers[launchKey].browserName,
      options,
    };
  });

  return clients;
}

function setLocalClients() /*: Array<?Object>*/ {
  const port = require('./chromeDriver').port;
  let isHeadless = process.env.HEADLESS !== 'false';
  // Keep only chrome for watch mode
  if (process.env.WATCH === 'true') isHeadless === 'false';
  const windowSize = '--window-size=1920,1200';
  const options = {
    port,
    logLevel: 'error',
    hostname: 'localhost',
    capabilities: {
      browserName: 'chrome',
      chromeOptions: isHeadless
        ? { args: ['--headless', windowSize] }
        : { args: [windowSize] },
    },
  };
  return [{ browserName: 'chrome', options }];
}

module.exports = { setLocalClients, setBrowserStackClients };
