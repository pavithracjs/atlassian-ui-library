import {
  getExampleUrl,
  loadExampleUrl,
} from '@atlaskit/visual-regression/helper';
import sendLogs from '@atlaskit/analytics-reporting';
import { toMatchSnapshot } from 'jest-snapshot';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';

interface ConsistencyReport {
  consistency: string;
  divergence: number;
}

expect.extend({
  toMatchWYSIWYGSnapshot(
    received: ConsistencyReport,
    testName: string,
    onImprovement: (percent: number) => void,
    onRegression: (percent: number) => void,
  ) {
    // @ts-ignore
    const snapshotData = this.snapshotState._snapshotData;
    const customCurrentTestName = `WYSIWYG Comparison: ${testName}`;
    // Check previous results (if they exist)
    const data: string = snapshotData[`${customCurrentTestName} 1`];
    if (data) {
      // Parse the data object by trimming the 'Object ' prefix, and the trailing comma off the last property.
      const trimmed = data
        .substr(7)
        .trim()
        .replace(/,\s*}$/, '}');
      const baseline = JSON.parse(trimmed);

      if (baseline && baseline.divergence) {
        // Measure difference
        const diff = baseline.divergence - received.divergence;
        const regressed = diff < 0;
        const percent = clampPercentage(regressed ? diff * -1 : diff);

        if (percent)
          console.warn(
            `${testName} ${regressed ? 'regressed' : 'improved'} ${percent}%`,
          );

        // Consistency improved
        if (received.divergence < baseline.divergence) {
          // FIXME: pass through renamed test into callbacks?
          onImprovement(percent);
        }
        // Consistency worsensed
        if (received.divergence > baseline.divergence) {
          onRegression(percent);
        }
      }
    } else {
      // This is the first time this test scenario has run.
      dispatchAnalyticsEvent(
        testName,
        1 - received.divergence,
        `${received.consistency}%`,
        'N/A',
      );
    }

    // Rename test using alternate 'this' for brevity and simplicity
    return toMatchSnapshot.call(
      { ...this, currentTestName: customCurrentTestName },
      received,
    );
  },
});

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

type AsyncAwaitFunction = (page: any) => Promise<void>;

/**
 * Compare snapshots of the editor & renderer to validate the WYSIWYG result.
 *
 * For use with tests which render both the editor and renderer instance on a page.
 *
 * Unlike regular VR tests we don't store visual snapshots (these are covered by the VR tests
 * inside `@atlaskit/editor-core` and `@atlaskit/renderer`), instead we store the percentage
 * values in a snapshot file to measure and track the visual consistency (or divergence) between
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
  waitFor?: AsyncAwaitFunction[],
) {
  const editor = await page.$(editorContentSelector);
  const renderer = await page.$(rendererContentSelector);

  if (waitFor && waitFor.length) {
    await Promise.all(
      waitFor.map(async (wait: AsyncAwaitFunction) => await wait(page)),
    );
  }

  const snapshotsPath = path.join(__dirname, '__image_snapshots__');
  if (!fs.existsSync(snapshotsPath)) fs.mkdirSync(snapshotsPath);

  const diffPath = path.join(snapshotsPath, '__diff_output__');

  // Take screenshots
  const editorImageBuffer = await editor.screenshot();
  const rendererImageBuffer = await renderer.screenshot();
  const editorImage = PNG.sync.read(editorImageBuffer);
  const rendererImage = PNG.sync.read(rendererImageBuffer);
  const { width, height } = editorImage;
  const diffImage = new PNG({ width, height });

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
  const consistency = clampPercentage(1 - divergence);

  const reportNode = {
    divergence,
    consistency: `${consistency}%`,
  };

  // Remove existing diff files prior to potential regeneration
  if (!fs.existsSync(diffPath)) fs.mkdirSync(diffPath);
  const testFilename = testName.replace(' ', '-');
  const imagePath = cleanupFile(
    path.join(diffPath, `wysiwyg-${testFilename}-erd.png`),
  );

  const debugging = process.env.DEBUG === 'true';

  if (debugging) {
    // Create composite image of result
    const compositeImage = createCompositeImage(
      editorImage,
      rendererImage,
      diffImage,
    );
    const compositeBuffer = PNG.sync.write(compositeImage, { filterType: 4 });

    // Write image to disk
    fs.writeFileSync(imagePath, compositeBuffer);
  }

  // To prevent regressions we fail if the visual consistency changes.
  // If the consistency improves please update the snapshot to reflect the change.
  // Otherwise, if it worsens, please investigata the cause and fix it if possible.
  // Or if it's due to downstream changes outside of your control, then you can update
  // the snapshot to reflect the new state. Only do this as a last resort!
  expect(reportNode).toMatchWYSIWYGSnapshot(
    testName,
    // Improvement callback
    (percent: number) => {
      // TODO: Only ping analytics when committeng via -u? and perhaps I should ping it when they're newly created/added too to set the baseline?

      // Update analytics
      dispatchAnalyticsEvent(
        testName,
        1 - divergence,
        `${consistency}%`,
        `${percent}%`,
      );
    },
    // Regression callback
    (percent: string) => {
      // Update analytics
      dispatchAnalyticsEvent(
        testName,
        1 - divergence,
        `${consistency}%`,
        `${-percent}%`,
      );

      // Create composite image of result
      const compositeImage = createCompositeImage(
        editorImage,
        rendererImage,
        diffImage,
      );
      const compositeBuffer = PNG.sync.write(compositeImage, { filterType: 4 });

      // Write image to disk for CI artefacts
      fs.writeFileSync(imagePath, compositeBuffer);
    },
  );
}

function createAnalyticsEventPayload(
  test: string,
  consistencyRaw: number,
  consistency: string,
  percentageChange: string,
) {
  const payload = {
    name: 'atlaskit.qa.wysiwyg_vr_test.consistency',
    server: process.env.CI ? 'master' : 'test',
    product: 'atlaskit',
    properties: {
      test,
      // Percentage (0 - 1) as a number. e.g. 0.9842367
      consistencyRaw,
      // Percentage (0 - 100) as a string. e.g. 98.42%
      consistency,
      // Percentage (-100 - 100) as a string (negative for regression) e.g. 4.3% or -1.2%
      change: percentageChange,
    },
    user: process.env.CI ? '-' : process.env.USER, // On CI we send as an anonymous user
    serverTime: Date.now(),
  };
  return JSON.stringify({ events: [payload] });
}

function dispatchAnalyticsEvent(
  test: string,
  consistencyRaw: number,
  consistency: string,
  percentageChange: string,
) {
  const updateSnapshot = process.env.UPDATE_SNAPSHOT === 'true';
  // For the purpose of tracking WYSIWYG consistency & divergence over time, we only care about when we
  // decide to commit to visual changes by updating the snapshot file.
  if (updateSnapshot) {
    const analytics = createAnalyticsEventPayload(
      test,
      consistencyRaw,
      consistency,
      percentageChange,
    );
    sendLogs(analytics).then(res => {
      console.log(
        `Sent WYSIWYG consistency change Event for '${test}'. Consistency: ${consistency}%, Change: ${percentageChange}`,
      );
    });
  }
}
