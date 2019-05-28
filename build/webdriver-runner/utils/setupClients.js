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

const WAITFORXXX_DEFAULT_TIMEOUT = 5e3; // 5s
const WAITFORXXX_MOBILE_TIMEOUT = 30e3; // 30s

function toBrowserStackClients(
  launchers /*: Object */ = {},
) /*: Array<?Object>*/ {
  return Object.keys(launchers).map(launchKey => ({
    browserName: launchers[launchKey].browserName,
    options: {
      capabilities: {
        os: launchers[launchKey].os,
        os_version: launchers[launchKey].os_version,
        browserName: launchers[launchKey].browserName,
        browserVersion: launchers[launchKey].browser_version,
        device: launchers[launchKey].device,
        realMobile: launchers[launchKey].realMobile,
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
      waitforTimeout:
        launchers[launchKey].waitforTimeout || WAITFORXXX_DEFAULT_TIMEOUT,
    },
  }));
}

function setBrowserStackClients() /*: Array<?Object>*/ {
  const RESOLUTION = '1920x1080';
  const launchers = {
    chrome: {
      os: 'Windows',
      os_version: '10',
      browserName: 'chrome',
      browser_version: '73.0',
      resolution: RESOLUTION,
    },
    firefox: {
      os: 'Windows',
      os_version: '10',
      browserName: 'firefox',
      browser_version: '66.0',
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
      browser_version: '12.0',
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

  return toBrowserStackClients(launchers);
}

function setBrowserStackMobileClients() /*: Array<?Object>*/ {
  const launchers = {
    iphone: {
      os_version: '9',
      browserName: 'iphone',
      device: 'iPhone 6S',
      resolution: '1334*750',
      realMobile: false,
      waitforTimeout: WAITFORXXX_MOBILE_TIMEOUT,
    },
    android: {
      os_version: '5.0',
      browserName: 'android',
      device: 'Google Nexus 5',
      resolution: '1080*1920',
      realMobile: false,
      waitforTimeout: WAITFORXXX_MOBILE_TIMEOUT,
    },
  };

  return toBrowserStackClients(launchers);
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

module.exports = {
  setLocalClients,
  setBrowserStackClients,
  setBrowserStackMobileClients,
};
