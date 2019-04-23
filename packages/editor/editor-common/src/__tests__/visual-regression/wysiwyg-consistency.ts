import { loadKitchenSinkWithAdf, snapshotWYSIWYG } from './_utils';

import path from 'path';
import fs from 'fs';

/*
function createDocumentADF(nodeName: string, containerNodes?: string[]) {
  const doc: any = {
    version: 1,
    type: "doc",
    content: []
  };
  
  const fragment = loadFragmentADF(nodeName);

  /\**
   * Insert fragment twice.
   * 
   * Content nodes may style the first instance in the document differently than subsequent instances,
   *\/
  doc.content.push(fragment);
  doc.content.push(fragment);

  // For the same reason as above, the first instance is reset when nested within a container
  if (containerNodes) {
    containerNodes.forEach(name => {
      const containerFragment = loadFragmentADF(name, true);
      // TODO: Iterate recursively down the tree, finding each empty content array and inserting the fragment inside it, twice!
      doc.content.push(containerFragment);
    });
  }

  return doc;
}
*/
function createDocumentADF(nodeName: string, containerNodeName?: string) {
  const doc: any = {
    version: 1,
    type: 'doc',
    content: [],
  };

  const fragment = loadFragmentADF(nodeName);

  // Insert fragment twice.
  // Content nodes may style the first instance in the document differently than subsequent instances.
  const fragmentContent = [fragment, fragment];

  if (containerNodeName) {
    const containerFragment = loadFragmentADF(containerNodeName, true);
    // TODO: Iterate recursively down the tree, finding each empty content array and inserting `fragmentContent` inside it
    doc.content = [containerFragment];
  } else {
    doc.content = fragmentContent;
  }

  return doc;
}

function loadFragmentADF(nodeName: string, isContainer = false) {
  if (nodeName.indexOf(' ')) nodeName = nodeName.replace(' ', '-');
  const fixturePath = path.join(
    __dirname,
    '__fixtures__',
    'adf-node-fragments',
    isContainer ? 'containers' : '',
    `${nodeName}-adf-node.json`,
  );
  console.log('### PATH: ' + fixturePath);
  if (fs.existsSync(fixturePath)) {
    const fixture = fs.readFileSync(fixturePath);
    const fragment: any = JSON.parse(fixture as any);
    return fragment;
  } else {
    // TODO: log the error...
    console.error(`Unable to load ADF Fragment: '${fixturePath}'`);
  }
  return {};
}

// TODO: Write WYSWWYG tests. FYI above test is skipped...
describe('WYSIWYG Snapshot Test: content nodes look consistent in editor & renderer', () => {
  let page: any;

  // const nodes =

  // const fixturesPath = path.join(__dirname, '__fixtures__', 'adf-nodes'); //path.join(path.dirname(__filename), '__fixtures__');
  // console.log(' ### FIXTURES PATH: ' + fixturesPath);

  // TODO: Wrap in promise with await? or use fs synchronise..
  /*
  fs.readdir(fixturesPath, { withFileTypes: true }, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err);
    files.forEach(function (file) {
      if (file.isFile()) {
        console.log(file);
        // populate array...
      }
    });
  });
  */

  // TODO: Setup array to iterate. Either component refs for manual content generation, or perhaps preexisting ADF files?

  /**
   * ADF Node Fragments for WYSIWYG consistency testing.
   *
   * Note: these node names should match the de-hyphenated name of the adf fragment json
   * files contained within `__fixtures__/adf-node-fragments`.
   *
   * We declare this explicit list instead of reading the directory's files via the file system,
   * as this gives us greater control to skip specific nodes, should the need ever arise.
   */
  const nodes = [
    // FIXME: Different scores each run :(
    'paragraph',
    // 'heading' // TODO: add custom logic to share single adf and change level value for al 6? or have 6 separate fragments?
    'bullet list',
    'ordered list',
    // TODO: Add others
    // TODO: Should i add container nodes at doc root too? how to avoid them attempting nesting?
  ];

  // Container nodes which support nesting the above nodes.
  const containerNodes = ['table', 'columns', 'panel'];

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    // await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    // TODO: Load editor once, clear content each time?
  });

  nodes.forEach((node: string) => {
    it(`${node} looks consistent at document root`, async () => {
      const adf = createDocumentADF(node);
      // const adf = createDocumentADF(node, containerNodes);
      await loadKitchenSinkWithAdf(page, adf);
      // await page.waitFor(30000);
      await snapshotWYSIWYG(page, node);
    });

    // TODO: Restore this eventually...
    /*
    containerNodes.forEach((container: string) => {
      it(`${node} looks consistent when nested inside ${container}`, async () => {
        const adf = createDocumentADF(node, container);
        await loadKitchenSinkWithAdf(page, adf);
        await snapshotWYSIWYG(page, node);
      });
    })
    */
  });
});
