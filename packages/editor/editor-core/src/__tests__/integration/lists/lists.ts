import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, fullpage, editable } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { KEY } from '../../__helpers/page-objects/_keyboard';

const PM_FOCUS_SELECTOR = '.ProseMirror-focused';

async function insertList(
  page: any,
  modifierKey: string,
  list: 'number' | 'bullet',
) {
  const listKey = list === 'number' ? '7' : '8';
  await page.browser.keys([modifierKey, KEY.SHIFT, listKey]);
  await page.browser.keys([modifierKey, KEY.SHIFT]); // release modifier keys
  await page.type(editable, 'item');
  await page.browser.keys(['Enter', 'Enter']); // double enter to exit list
}

BrowserTestCase(
  `list: shouldn't change focus on tab if the list is not indentable`,
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    // Investigate why string based input (without an array) fails in firefox
    // https://product-fabric.atlassian.net/browse/ED-7044
    await page.type(editable, '* '.split(''));
    await page.type(editable, 'abc');
    await page.keys('Return');
    await page.keys('Tab');
    await page.type(editable, '123');
    await page.keys('Tab');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
    expect(await page.isExisting(PM_FOCUS_SELECTOR)).toBeTruthy();
  },
);

BrowserTestCase(
  'list: should be able to insert lists via keyboard shortcut (Windows)',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page', allowLists: true });
    await page.click(editable);
    await insertList(page, KEY.CONTROL, 'number');
    await insertList(page, KEY.CONTROL, 'bullet');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'list: should be able to insert lists via keyboard shortcut (Mac)',
  { skip: ['ie', 'edge', 'chrome', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page', allowLists: true });
    await page.click(editable);
    await insertList(page, KEY.META, 'number');
    await insertList(page, KEY.META, 'bullet');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
