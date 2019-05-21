import {
  createDocumentADF,
  loadKitchenSinkWithAdf,
  snapshotAndCompare,
} from './_wysiwyg-utils';
import { traverse } from '@atlaskit/adf-utils/traverse';

type FragmentNodeLookup = { node: string; waitForSelector?: string };

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
  const contentNodes: FragmentNodeLookup[] = [
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

  const containerNodes: FragmentNodeLookup[] = [
    { node: 'table' },
    { node: 'columns' },
    { node: 'panel' },
  ];

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await page.setViewport({ width: 2000, height: 1000 });
  });

  describe('Standalone content', () => {
    // Here we filter out nodes that don't render anything in their initial state
    const standaloneNodes = contentNodes.concat(
      containerNodes.filter(
        (node: FragmentNodeLookup) => node.node !== 'columns',
      ),
    );

    it.each(standaloneNodes)('%o', async ({ node, waitForSelector }) => {
      const adf = createDocumentADF(node);
      await loadKitchenSinkWithAdf(page, adf);
      await snapshotAndCompare(page, node, waitForSelector);
    });
  });

  describe.each(containerNodes)(
    'Nested content: %o',
    async ({ node: containerNode }: FragmentNodeLookup) => {
      const containerAdf = createDocumentADF(containerNode, true);
      // Nested nodes
      it.each(contentNodes)(
        `%o inside ${containerNode}`,
        async ({ node: contentNode, waitForSelector }: FragmentNodeLookup) => {
          const contentAdf = createDocumentADF(contentNode).content;
          const adf = traverse(containerAdf, {
            any: (node: any) => {
              if (node.content && node.content.length === 0) {
                // Insert nested content
                node.content = contentAdf;
              }
              return node;
            },
          });
          await loadKitchenSinkWithAdf(page, adf);
          await snapshotAndCompare(
            page,
            `${contentNode} inside ${containerNode}`,
            waitForSelector,
          );
        },
      );
    },
  );
});
