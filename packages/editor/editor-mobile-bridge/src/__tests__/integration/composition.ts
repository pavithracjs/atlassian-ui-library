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
  { skip: skip.concat('safari'), mobile: true },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, "soon we'll test composition here");
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
