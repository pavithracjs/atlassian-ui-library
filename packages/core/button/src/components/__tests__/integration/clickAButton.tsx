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
const buttonExampleUrl = getExampleUrl('core', 'button', 'ButtonExample');

BrowserTestCase('Primary button test', { skip: [] }, async (client: any) => {
  const primaryButton = '[aria-label="primary"]';
  const buttonTest = new Page(client);
  await buttonTest.goto(buttonExampleUrl);
  await buttonTest.waitForSelector(primaryButton);
  await buttonTest.click(primaryButton);
  const alert = await buttonTest.getAlertText();
  expect(alert).toBe('primary clicked');
});
