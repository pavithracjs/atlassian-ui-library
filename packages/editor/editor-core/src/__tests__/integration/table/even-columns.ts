import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
  doubleClickResizeHandle,
} from '../_helpers';
import {
  clickFirstCell,
  selectTable,
} from '../../__helpers/page-objects/_table';
import {
  tableWithUnevenColumns,
  tableWithUnevenColumnsInOverflow,
} from './__fixtures__/even-columns';

import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Should even columns on double click on resize handle when table is selected',
  { skip: ['ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithUnevenColumns),
      allowTables: {
        advanced: true,
      },
    });
    await clickFirstCell(page);
    await selectTable(page);
    await doubleClickResizeHandle(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should even columns and remain overflown on double click on resize handle when table is selected',
  { skip: ['ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithUnevenColumnsInOverflow),
      allowTables: {
        advanced: true,
      },
    });
    await clickFirstCell(page);
    await selectTable(page);
    await doubleClickResizeHandle(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
