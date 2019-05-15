import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  callNativeBridge,
  editor,
  editable,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

// https://product-fabric.atlassian.net/browse/ED-6877
BrowserTestCase(
  'currentSelection when no selection',
  // Safari has issues with key events
  { skip: skip.concat('safari', 'chrome') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'Normal Text');
    await browser.keys('ArrowLeft');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when selection',
  // Safari has issues with key events
  { skip: skip.concat('safari', 'chrome') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'Normal Text');

    await browser.pressKey('ArrowLeft', 4);
    await browser.keys('Shift');
    await browser.pressKey('ArrowRight', 4);
    await browser.keys('Shift');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when cursor is on link',
  // Safari has issues with key events
  { skip: skip.concat('safari', 'chrome') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Atlassian',
      'https://www.google.com',
    );
    await browser.keys('ArrowLeft');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

// https://product-fabric.atlassian.net/browse/ED-6877
BrowserTestCase(
  'currentSelection when cursor is selecting a link',
  // Safari has issues with key events
  { skip: skip.concat('safari', 'chrome') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Atlassian',
      'https://www.google.com',
    );

    await browser.pressKey('ArrowLeft', 9);
    await browser.keys('Shift');
    await browser.pressKey('ArrowRight', 9);
    await browser.keys('Shift');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when cursor is selecting text and link',
  // Safari has issues with key events
  { skip: skip.concat('safari', 'chrome') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'This is a ');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'link',
      'https://www.google.com',
    );

    await browser.pressKey('ArrowLeft', 10);
    await browser.keys('Shift');
    await browser.pressKey('ArrowRight', 10);
    await browser.keys('Shift');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );

    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);
