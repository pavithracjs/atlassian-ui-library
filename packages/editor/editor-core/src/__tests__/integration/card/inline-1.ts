import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  clipboardHelper,
  copyAsPlaintextButton,
  clipboardInput,
} from '../_helpers';

BrowserTestCase(
  `inline-1.ts: pasting a link converts to an inline card`,
  {
    skip: ['ie', 'safari'],
  },
  async (client: any, testName: string) => {
    let browser = new Page(client);

    // copy stuff to clipboard
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(clipboardInput, 'https://www.atlassian.com');
    await browser.click(copyAsPlaintextButton);

    // open up editor
    await browser.goto(fullpage.path);
    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);
    await browser.waitForSelector(editable);

    // type some text into the paragraph first
    await browser.type(editable, 'hello have a link ');

    // paste the link
    await browser.paste(editable);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
