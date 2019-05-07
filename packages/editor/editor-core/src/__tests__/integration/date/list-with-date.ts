import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

// TODO: safari keys do not work after upgrade
BrowserTestCase(
  'status.ts: Insert date into list, continue, then click back on date',
  { skip: ['ie', 'safari'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await browser.type(editable, '* abc ');
    await quickInsert(browser, 'Date');
    await browser.waitForSelector(`[aria-label="calendar"]`);
    await browser.click(editable);
    await browser.waitForSelector(`[aria-label="calendar"]`, {}, true); // removed.
    await browser.type(editable, 'def');

    // Click status, and wait for popup
    await browser.click('.dateView-content-wrap');
    await browser.waitForSelector(`[aria-label="calendar"]`);
    await browser.click(editable);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
