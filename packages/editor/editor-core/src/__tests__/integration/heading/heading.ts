import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { headings } from './__fixtures__/headings';

import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Headings will generate correct anchor name',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async (client: any, _testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowHeadingAnchorLinks: true,
      defaultValue: JSON.stringify(headings),
    });

    expect(await page.isExisting('#Heading-dup')).toBe(true);
    expect(await page.isExisting('#Heading-dup\\.1')).toBe(true);
    expect(await page.isExisting('#Heading-dup\\.2')).toBe(true);
  },
);
