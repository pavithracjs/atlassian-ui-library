import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editor,
  editable,
  getDocFromElement,
  skipBrowsers as skip,
} from './_utils';

BrowserTestCase(
  `composition.ts: Support state update between composition events`,
  { skip, mobile: true },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto('https://danburzo.github.io/input-methods/index.html');
    await browser.waitForSelector('#rte--raw');
    await browser.sendKeys('#rte--raw', "soon we'll test composition here");
    //const doc = await browser.$eval(editable, getDocFromElement);
    //expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
