import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { fullpageDisabled } from '../_helpers';

const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in the disabled editor",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await browser.click(fullpageDisabled.placeholder);
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.stringContaining('Element is not clickable at point'),
    );
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in a panel",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await browser.click('.ak-editor-panel__content');
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.stringContaining('Element is not clickable at point'),
    );
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in a table",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await browser.click('.pm-table-cell-nodeview-content-dom');
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.stringContaining('Element is not clickable at point'),
    );
    spy.mockRestore();
  },
);
