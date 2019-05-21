import {
  getExampleUrl,
  loadExampleUrl,
} from '@atlaskit/visual-regression/helper';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';

/**
 * Create an ADF document from a loaded JSON fragment.
 *
 * @param nodeName The name of the node fragment you wish to insert
 * @param containerNodeName Optional container node fragment to nest within.
 */
export function createDocumentADF(nodeName: string, isContainer = false) {
  const doc: any = {
    version: 1,
    type: 'doc',
    content: [],
  };

  const fragment = loadFragmentADF(nodeName, isContainer);

  if (isContainer) {
    // Insert fragment once to serve as a placeholder, for later content injection.
    doc.content = [fragment];
  } else {
    // Insert fragment three times because content nodes may style the first and last instance differently from other instances.
    doc.content = [fragment, fragment, fragment];
  }

  return doc;
}

/**
 * Some content nodes deliberately appear differently in editor versus renderer.
 *
 * These styles attempt to normalize the appearance of the deselected node in
 * order to get the closest representation for comparison.
 */
async function normalizeStyles(page: any) {
  const css = `
    .ProseMirror [data-layout-section] > * {
      /* Disable layout column borders within editor */
      border: none !important;
    }
  `;
  await page.addStyleTag({ content: css });
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

  if (fs.existsSync(fixturePath)) {
    const fixture = fs.readFileSync(fixturePath);
    const fragment: any = JSON.parse(fixture as any);
    return fragment;
  } else {
    // eslint-disable-next-line no-console
    console.error(`Unable to load ADF Fragment: '${fixturePath}'`);
  }
  return {};
}

const adfToggleSelector = '#adf-toggle';
const adfInputSelector = '#adf-input';
const importAdfBtnSelector = '#import-adf';
const editorContentSelector = '.ProseMirror';
const rendererContentSelector = '.ak-renderer-document';
const editorSelectedNode = '.ProseMirror-selectednode';

// TODO: Convert to custom 99-wysiwyg-testing version once POC is proven?
export const loadKitchenSinkWithAdf = async (page: any, adf: any) => {
  const url = getExampleUrl('editor', 'editor-core', 'kitchen-sink');
  await loadExampleUrl(page, url);

  await normalizeStyles(page);

  // Load the ADF into the editor & renderer.
  await page.waitForSelector(adfToggleSelector);
  await page.click(adfToggleSelector);
  await page.waitForSelector(adfInputSelector);
  await page.evaluate(
    (editorSelector: string, adfInputSelector: string, adf: object) => {
      const doc = document as any;
      const contentEditable = doc.querySelector(editorSelector);
      // Reset the content height prior to assigning new ADF (renderer is removed from DOM at this point)
      contentEditable.style.height = null;
      // Disable native spell checker for visual consistency
      contentEditable.setAttribute('spellcheck', false);
      // Assign ADF
      doc.querySelector(adfInputSelector).value = JSON.stringify(adf);
    },
    editorContentSelector,
    adfInputSelector,
    adf,
  );
  await page.click(importAdfBtnSelector);
  await page.evaluate(
    (
      editorSelector: string,
      rendererSelector: string,
      selectedNodeSelector: string,
    ) => {
      const doc = document as any;
      const editor = doc.querySelector(editorSelector);
      const renderer = doc.querySelector(rendererSelector);
      const editorContentHeight = editor.offsetHeight;
      const rendererContentHeight = renderer.offsetHeight;

      // Remove styles based on user selected node.
      // These don't have a parellel in the renderer.
      const selectedNodes: HTMLElement[] = Array.from(
        doc.querySelectorAll(selectedNodeSelector),
      );
      selectedNodes.forEach((element: HTMLElement) =>
        element.classList.remove(selectedNodeSelector.substr(1)),
      );

      // Resize to match consistent height for snapshot comparison.
      editor.style.height = renderer.style.height =
        Math.max(editorContentHeight, rendererContentHeight) + 'px';
    },
    editorContentSelector,
    rendererContentSelector,
    editorSelectedNode,
  );
  // Remove focus from the editor to ensure interactive UI control differences dissapear.
  await page.click(rendererContentSelector);
};

interface ConsistencyReportNode {
  name: string;
  divergence: number;
  consistency: string;
}

interface ConsistencyReport {
  name?: string;
  description?: string;
  nodes: ConsistencyReportNode[];
}

// Load WYSIWYG consistency report JSON
function loadConsistencyReport(path: string): ConsistencyReport {
  if (fs.existsSync(path)) {
    const reportData = fs.readFileSync(path);
    return JSON.parse(reportData as any);
  } else {
    // eslint-disable-next-line no-console
    console.error(`Unable to load WYSIWYG consistency report: ${path}`);
  }

  return { nodes: [] };
}

// Find or create a report node
function getReportNode(
  testName: string,
  report: ConsistencyReport,
): ConsistencyReportNode {
  const { nodes } = report;
  let reportNode = nodes.find(
    (node: { name: string }) => node.name === testName,
  );

  if (!reportNode) {
    reportNode = {
      name: testName,
      divergence: 1,
      consistency: '0%',
    };
    // Inject new node and sort alphabetically
    nodes.push(reportNode);
    nodes.sort((a: { name: string }, b: { name: string }) =>
      a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
  }

  return reportNode;
}

function createCompositeImage(
  editorImage: any,
  rendererImage: any,
  diffImage: any,
) {
  // create a new image containing the images for editor, renderer, and their diff.
  const { width, height } = editorImage;
  const compositeImage = new PNG({
    width: width * 3 + 2,
    height: editorImage.height,
  });

  [editorImage, rendererImage, diffImage].forEach((image, i) => {
    PNG.bitblt(image, compositeImage, 0, 0, width, height, width * i + i, 0);
  });
  return compositeImage;
}

function cleanupFile(filePath: string): string {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  return filePath;
}

function clampPercentage(value: number): number {
  return parseFloat(((Math.round(value * 10000) / 10000) * 100).toFixed(2));
}

/**
 * Compare snapshots of the editor & renderer to validate the WYSIWYG result.
 *
 * For use with tests which render both the editor and renderer instance on a page.
 *
 * Unlike regular VR tests we don't store visual snapshots (these are covered by the VR tests
 * inside `@atlaskit/editor-core` and `@atlaskit/renderer`), instead we store the percentage
 * values in a JSON file to measure and track the visual consistency (or divergence) between
 * the rendered results of the editor & renderer.
 *
 * Similar to regular VR testing, if changes result in widening the gap, an image based
 * snapshot file is output (git ignored) to show the difference.
 *
 * If the changes result in improved visual consistency then the updated percentage(s)
 * are written to the JSON file to be used as the new baseline.
 *
 * Tests will fail if the visual divergence widens.
 */
export async function snapshotAndCompare(
  page: any,
  testName: string,
  waitForSelector?: string,
) {
  const editor = await page.$(editorContentSelector);
  const renderer = await page.$(rendererContentSelector);

  if (waitForSelector) await page.waitForSelector(waitForSelector);

  const snapshotsPath = path.join(__dirname, '__image_snapshots__');
  if (!fs.existsSync(snapshotsPath)) fs.mkdirSync(snapshotsPath);

  const diffPath = path.join(snapshotsPath, '__diff_output__');
  const consistencyReportPath = path.join(
    __dirname,
    'wysiwyg-consistency.json',
  );

  // Load existing baseline figures
  const report = loadConsistencyReport(consistencyReportPath);

  // Take screenshots
  const editorImageBuffer = await editor.screenshot();
  const rendererImageBuffer = await renderer.screenshot();
  const editorImage = PNG.sync.read(editorImageBuffer);
  const rendererImage = PNG.sync.read(rendererImageBuffer);
  const { width, height } = editorImage;
  const diffImage = new PNG({ width, height });

  // Find the node for this test
  const reportNode = getReportNode(testName, report);

  // Measure change
  const diffPixelCount = pixelmatch(
    editorImage.data,
    rendererImage.data,
    diffImage.data,
    width,
    height,
    { includeAA: true },
  );

  const totalPixels = editorImage.width * editorImage.height;
  const divergence = diffPixelCount / totalPixels;
  let divergenceBaseline = reportNode.divergence;

  const updateSnapshot = process.env.UPDATE_SNAPSHOT === 'true';
  const debugging = process.env.DEBUG === 'true';

  // Improved consistency, or explicitly updating snapshot
  if ((divergence < divergenceBaseline && !debugging) || updateSnapshot) {
    // Update the report to relect this as the new baseline.
    reportNode.consistency = clampPercentage(1 - divergence) + '%';
    reportNode.divergence = divergence;
    // Updated reports need to be committed by a developer to remain tracked.
    fs.writeFileSync(consistencyReportPath, JSON.stringify(report, null, 2));

    if (updateSnapshot) divergenceBaseline = divergence;
  }

  // Remove existing diff files prior to potential regeneration
  if (!fs.existsSync(diffPath)) fs.mkdirSync(diffPath);
  const testFilename = testName.replace(' ', '-');
  const imagePath = cleanupFile(
    path.join(diffPath, `wysiwyg-${testFilename}-erd.png`),
  );
  const textPath = cleanupFile(
    path.join(diffPath, `wysiwyg-${testFilename}-fig.txt`),
  );

  // Decreased consistency
  if (divergence > divergenceBaseline || debugging) {
    // Create composite image of result
    const compositeImage = createCompositeImage(
      editorImage,
      rendererImage,
      diffImage,
    );
    const compositeBuffer = PNG.sync.write(compositeImage, { filterType: 4 });

    // Write image to disk
    fs.writeFileSync(imagePath, compositeBuffer);

    if (divergence !== divergenceBaseline) {
      const diff = divergenceBaseline - divergence;
      const regressed = diff < 0;
      const percent = clampPercentage(regressed ? diff * -1 : diff);

      // Write percentages to disk
      fs.writeFileSync(
        textPath,
        `baseline: ${divergenceBaseline}\ncurrent: ${divergence}\n${
          regressed ? 'regressed' : 'improved'
        }: ${percent}%`,
      );
    }
  }

  // To prevent regressions we fail if the visual consistency worsens
  expect(divergence).toBeLessThanOrEqual(divergenceBaseline);
}
