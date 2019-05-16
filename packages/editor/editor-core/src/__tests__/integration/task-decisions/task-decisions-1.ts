import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  gotoEditor,
  editable,
  insertBlockMenuItem,
  copyToClipboard,
} from '../_helpers';

/*
 * Safari adds special characters that end up in the snapshot
 */

// Cannot paste rich text in IE/Edge
BrowserTestCase(
  'task-decision-1.ts: can paste rich text into a decision',
  { skip: ['ie', 'safari', 'edge'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await copyToClipboard(
      browser,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
      'html',
    );
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-1.ts: can paste plain text into a decision',
  { skip: ['ie', 'safari'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await copyToClipboard(
      browser,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// Safari highlights entire text on click
// IE is generally flaky
BrowserTestCase(
  'task-decision-1.ts: can type into decision',
  { skip: ['ie', 'safari', 'edge'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await insertBlockMenuItem(browser, 'Decision');
    await browser.waitForSelector('ol span + div');
    await browser.click('ol span + div');
    await browser.type(editable, 'adding decisions');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
