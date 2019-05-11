import {
  createDocumentADF,
  loadKitchenSinkWithAdf,
  snapshotAndCompare,
} from './_wysiwyg-utils';

describe('WYSIWYG Snapshot Test: looks consistent in editor & renderer', () => {
  let page: any;

  /**
   * ADF Node Fragments for WYSIWYG consistency testing.
   *
   * Note: these node names should match the de-hyphenated name of the adf fragment json
   * files contained within `__fixtures__/adf-node-fragments`.
   *
   * We declare this explicit list instead of reading the directory's files via the file system,
   * as this gives us greater control to skip specific nodes, should the need ever arise.
   *
   * Because these tests need to be deterministic, if a node requires additional time to load
   * a resource you can add a `waitForSelector` value to defer the screenshot until it's available.
   */
  const nodes: { node: string; waitForSelector?: string }[] = [
    { node: 'actions' },
    { node: 'blockquote' },
    { node: 'bullet list' },
    { node: 'codeblock' },
    { node: 'date' },
    { node: 'decisions' },
    { node: 'divider' },
    { node: 'emoji', waitForSelector: '.emoji-common-emoji-sprite' },
    { node: 'heading' },
    { node: 'mention' },
    { node: 'ordered list' },
    { node: 'paragraph' },
    { node: 'status' },
  ];

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await page.setViewport({ width: 2000, height: 1000 });
  });

  it.each(nodes)('%o', async ({ node, waitForSelector }) => {
    const adf = createDocumentADF(node);
    await loadKitchenSinkWithAdf(page, adf);
    await snapshotAndCompare(page, node, waitForSelector);
  });
});
