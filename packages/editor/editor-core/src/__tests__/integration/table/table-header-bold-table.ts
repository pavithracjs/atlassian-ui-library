import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import { TableCssClassName } from '../../../plugins/table/types';

BrowserTestCase(
  'should add strong mark on table header by default',
  { skip: [] },
  async client => {
    const CELL = `tr:first-child .${
      TableCssClassName.TABLE_HEADER_NODE_WRAPPER
    }:first-child .${TableCssClassName.CELL_NODEVIEW_WRAPPER} p`;
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);
    await quickInsert(page, 'Table');
    await page.waitForSelector(CELL);

    await page.click(CELL);
    await page.type(editable, 'this text should be bold');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'should add strong mark on table header columns by default',
  { skip: [] },
  async client => {
    const CELL_NOT_BOLD = `tr:nth-child(2) .${
      TableCssClassName.TABLE_CELL_NODE_WRAPPER
    }:first-child .${TableCssClassName.CELL_NODEVIEW_WRAPPER} p`;
    const CELL_BOLD = `tr:nth-child(3) .${
      TableCssClassName.TABLE_HEADER_NODE_WRAPPER
    }:first-child .${TableCssClassName.CELL_NODEVIEW_WRAPPER} p`;
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);
    await quickInsert(page, 'Table');

    await page.click(CELL_NOT_BOLD);
    await page.type(editable, 'this text should not be bold');

    await page.click(`[aria-label="Table options"]`);
    await page.click(`[aria-label="Header column"]`);

    await page.click(CELL_BOLD);
    await page.type(editable, 'this text should be bold');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
