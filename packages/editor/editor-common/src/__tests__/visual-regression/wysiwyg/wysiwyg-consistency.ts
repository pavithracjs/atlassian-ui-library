import {
  createDocumentADF,
  loadKitchenSinkWithAdf,
  snapshotAndCompare,
} from './_wysiwyg-utils';

describe('WYSIWYG Snapshot Test: content nodes look consistent in editor & renderer', () => {
  let page: any;

  /**
   * ADF Node Fragments for WYSIWYG consistency testing.
   *
   * Note: these node names should match the de-hyphenated name of the adf fragment json
   * files contained within `__fixtures__/adf-node-fragments`.
   *
   * We declare this explicit list instead of reading the directory's files via the file system,
   * as this gives us greater control to skip specific nodes, should the need ever arise.
   */
  const nodes = ['paragraph', 'bullet list', 'ordered list'];

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
  });

  nodes.forEach((node: string) => {
    it(`${node} looks consistent at document root`, async () => {
      const adf = createDocumentADF(node);
      await loadKitchenSinkWithAdf(page, adf);
      await snapshotAndCompare(page, node);
    });
  });
});
