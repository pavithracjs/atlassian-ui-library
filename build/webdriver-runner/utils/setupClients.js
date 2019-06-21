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

const WAITFORXXX_DEFAULT_TIMEOUT = 10e3; // 10s

function toBrowserStackClients(
  launchers /*: Object */ = {},
  options /*: {user?: string | null, key?: string | null} */ = {},
) /*: Array<?Object>*/ {
  return Object.keys(launchers).map(launchKey => ({
    browserName: launchers[launchKey].browserName,
    options: {
      capabilities: {
        os: launchers[launchKey].os,
        os_version: launchers[launchKey].os_version,
        browser: launchers[launchKey].browser,
        browserName: launchers[launchKey].browserName,
        browserVersion: launchers[launchKey].browser_version,
        device: launchers[launchKey].device,
        deviceOrientation: launchers[launchKey].deviceOrientation,
        real_mobile: launchers[launchKey].real_mobile,
        project: 'Atlaskit Webdriver Tests',
        build: process.env.BITBUCKET_BRANCH,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.idleTimeout': 300,
        'browserstack.localIdentifier': commit,
        'browserstack.appium_version':
          launchers[launchKey]['browserstack.appium_version'],
        'browserstack.appiumLogs': true,
        'browserstack.networkProfile':
          launchers[launchKey]['browserstack.networkProfile'],
        resolution: launchers[launchKey].resolution,
        acceptSslCerts: true,
      },
      logLevel: 'error',
      user: options.user || process.env.BROWSERSTACK_USERNAME,
      key: options.key || process.env.BROWSERSTACK_KEY,
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
  const commonProps = {
    real_mobile: 'true',
    'browserstack.appiumLogs': true,
  };
  const androidProps = {
    os: 'android',
    browser: 'Android',
    'browserstack.appium_version': '1.12.1',
  };
  const iphoneProps = {
    os: 'ios',
    browser: 'iPhone',
    'browserstack.appium_version': '1.9.1',
  };
  const ipadProps = {
    os: 'ios',
    browser: 'iPad',
    'browserstack.appium_version': '1.9.1',
  };

  const launchers = {
    iPhone8Plus: {
      os_version: '11.3', // 11.0, 11.2,11.3,11.4,12.1 for JS
      browserName: 'iphone',
      device: 'iPhone 8 Plus',
      ...commonProps,
      ...iphoneProps,
    },
    pixel3: {
      os_version: '9.0', // Android 28
      browserName: 'android',
      device: 'Google Pixel 3',
      ...commonProps,
      ...androidProps,
    },
    /*
    pixel2: {
      os_version: '8.0', // Android 27
      browserName: 'android',
      device: 'Google Pixel 2',
      ...commonProps,
      ...androidProps
    },
    nexus6: {
      os_version: '6.0', // Android 23
      browserName: 'android',
      device: 'Google Nexus 6',
      ...commonProps,
      ...androidProps
    },
    galaxyTab: {
      os_version: '8.0', // Android 27
      browserName: 'android',
      device: 'Galaxy Tab S4',
      ...commonProps,
      ...androidProps
    },
    iPhone8: {
      os_version: '12.0', // iOS 12
      browserName: 'iphone',
      device: 'iPhone 8',
      ...commonProps,
      ...iosProps
    },
    iPhone7: {
      os_version: '10.0', // iOS 10
      browserName: 'iphone',
      device: 'iPhone 7',
      ...commonProps,
      ...iosProps
    },
    iPhone6: {
      os_version: '8.0', // iOS 8
      browserName: 'iphone',
      device: 'iPhone 6',
      ...commonProps,
      ...iosProps
    },
    iPhoneSE: {
      os_version: '11.0', // iOS 11
      browserName: 'iphone',
      device: 'iPhone SE',
      ...commonProps,
      ...iosProps
    },
    iPad: {
      os_version: '11.0', // iOS 11
      browserName: 'ipad',
      device: 'iPad 6th',
      ...commonProps,
      ...iosProps
    },
    iPadMini4: {
      os_version: '11.0', // iOS 11
      browserName: 'ipad',
      device: 'iPad Mini 4',
      ...commonProps,
      ...iosProps
    },
    */
  };

  return toBrowserStackClients(launchers, {
    user: process.env.BROWSERSTACK_MOBILE_USERNAME,
    key: process.env.BROWSERSTACK_MOBILE_KEY,
  });
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
