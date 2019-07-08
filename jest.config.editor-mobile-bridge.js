//@flow
const jestDefaultConfig = require('./jest.config');

const { USER_AGENT } = process.env;

const config = {
  ...jestDefaultConfig,
  testMatch: [
    `${__dirname}/packages/editor/editor-mobile-bridge/src/__tests__/**/*.(js|tsx|ts)`,
  ],
  testPathIgnorePatterns: [
    // ignore files under __tests__ that start with "one" underscore
    '/__tests__\\/.*?\\/_[^_].*?',
    // ignore files inder __third-party__ folders
    '/__tests__\\/.*?\\/__third-party__.*?',
    // ignore tests under __tests__/flow
    '/__tests__\\/flow/',
    // ignore tests under __tests__/integration (we override this if the INTEGRATION_TESTS flag is set)
    '/__tests__\\/integration/',
    // ignore tests under __tests__/vr (we override this if the VISUAL_REGRESSION flag is set)
    '/__tests__\\/visual-regression/',
  ],
  // Jest's default test environment 'jsdom' uses JSDOM 11 to support Node 6. Here we upgrade to JSDOM 14, which supports Node >= 8.
  // This script allows "resourceLoaderOptions" object (passed into "testEnvironmentOptions") to initialize a JSDOM's ResourceLoader.
  testEnvironment: `${__dirname}/build/jest-config/setup-jsdom-environment.js`,
  testEnvironmentOptions: {
    // Using JSDOM's ResourceLoader:
    // - to load images (https://github.com/jsdom/jsdom/issues/2345)
    // - to inject a custom user-agent
    // - created using "resourceLoaderOptions" to solve a classloading problem (similar to https://github.com/facebook/jest/issues/2549)
    resourceLoaderOptions: {
      userAgent: USER_AGENT,
    },
  },
};

if (USER_AGENT) {
  if (/Android \d/.test(USER_AGENT)) {
    config.testPathIgnorePatterns.push('/__tests__\\/.*?\\/__ios__.*?');
  } else if (/AppleWebKit/.test(USER_AGENT) && /Mobile\/\w+/.test(USER_AGENT)) {
    config.testPathIgnorePatterns.push('/__tests__\\/.*?\\/__android__.*?');
  }
}

module.exports = config;
