import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const baseADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1',
            type: 'file',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

BrowserTestCase(
  'copy-mediaGroup.ts: Copies and pastes mediaGroup file card on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testCase: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseADF),
      media: {
        allowMediaSingle: true,
      },
    });

    const fileCardSelector =
      '.ProseMirror .mediaGroupView-content-wrap .overlay';
    await page.waitForSelector(fileCardSelector);
    await page.click(fileCardSelector);
    // https://product-fabric.atlassian.net/browse/ED-7063
    // Firefox fails unless we click the file twice.
    await page.click(fileCardSelector);
    await page.copy(editable);

    await page.click(editable);
    await page.type(editable, 'pasting');

    await page.paste(editable);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
