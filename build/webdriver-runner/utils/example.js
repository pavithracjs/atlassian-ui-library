// @flow

/*
 * util to support defining url for the examples website to be used in webdriver tests.
 */

/**
 * `bs-local.com` will redirect to localhost (127.0.0.0) via the established SSH tunnel
 * when performing local testing (which we use locally and in CI).
 *
 * This is needed to correctly resolve our examples on Safari (MacOS & iOS).
 * It works for all browsers and platforms.
 *
 * Also, ensure `disableHostCheck` is set to `true` within your Webpack Dev Server
 * configuration, otherwise the examples won't be reachable from this alternate URL.
 *
 * @see https://www.browserstack.com/question/663
 * @see https://www.browserstack.com/question/759
 * @see https://www.browserstack.com/question/758
 */
const baseUrl = 'http://bs-local.com:9000';

const getExampleUrl = (
  group /*: string */,
  packageName /*: string */,
  exampleName /*: string */ = '',
) =>
  `${baseUrl}/examples.html?groupId=${group}&packageId=${packageName}&exampleId=${exampleName}`;

module.exports = {
  baseUrl,
  getExampleUrl,
};
