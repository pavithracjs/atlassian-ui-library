// @flow

/* Currently, this test will check if the form and its component renders into different browsers.
Some actual functional tests need to be added:
- Interaction with all fields
- Submit the form
Those tests should be added before the release candidate*/
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const navigationExampleUrl = getExampleUrl(
  'core',
  'global-navigation',
  'basic-global-navigation-using-ai',
);

BrowserTestCase('Search icon test', { skip: [] }, async (client: any) => {
  const searchIcon = '#quickSearchGlobalItem';
  const homePage = new Page(client);
  await homePage.goto(navigationExampleUrl);
  await homePage.waitForSelector(searchIcon);
  await homePage.click(searchIcon);
  const alert = await homePage.getAlertText();
  expect(alert).toBe('search clicked');
});
