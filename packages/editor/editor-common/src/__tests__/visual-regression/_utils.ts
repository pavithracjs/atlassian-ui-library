import {
  compareScreenshot,
  getExampleUrl,
  loadExampleUrl,
} from '@atlaskit/visual-regression/helper';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 600;

const adfInputSelector = '#adf-input';
const adfToggleSelector = '#adf-toggle';
const importAdfBtnSelector = '#import-adf';
const editorContentSelector = '.ProseMirror';
const rendererContentSelector = '.ak-renderer-document';

export const loadFullPageEditorWithAdf = async (page: any, adf: any) => {
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'full-page-with-adf-import',
  );
  await loadExampleUrl(page, url);
  await page.waitForSelector(adfInputSelector);
  await page.evaluate(
    (adfInputSelector: string, adf: object) => {
      (document as any).querySelector(adfInputSelector).value = JSON.stringify(
        adf,
      );
    },
    adfInputSelector,
    adf,
  );
  await page.click(importAdfBtnSelector);
};

export const loadKitchenSinkWithAdf = async (page: any, adf: any) => {
  const currentUrl = await page.url();
  const url = getExampleUrl('editor', 'editor-core', 'kitchen-sink');

  await page.setViewport({ width: 2000, height: 1000 });

  // Only load the page the first time. Subsequent calls simply replace the ADF.
  if (currentUrl !== url) {
    await page.goto(url);
  }

  // Load the ADF into the editor & renderer.
  await page.click(adfToggleSelector);
  await page.waitForSelector(adfInputSelector);
  await page.evaluate(
    (adfInputSelector: string, adf: object) => {
      (document as any).querySelector(adfInputSelector).value = JSON.stringify(
        adf,
      );
    },
    adfInputSelector,
    adf,
  );
  await page.click(importAdfBtnSelector);
  await page.evaluate(
    (editorSelector: string, rendererSelector: string) => {
      const editor = (document as any).querySelector(editorSelector);
      const renderer = (document as any).querySelector(rendererSelector);
      const editorContentHeight = editor.offsetHeight;
      const rendererContentHeight = renderer.offsetHeight;
      // Resize to match consistent height for snapshot comparison.
      editor.style.height = renderer.style.height =
        Math.max(editorContentHeight, rendererContentHeight) + 'px';
    },
    editorContentSelector,
    rendererContentSelector,
  );
  // Remove focus from the editor to ensure interactive UI control differences dissapear.
  await page.click(rendererContentSelector);
};

export const snapshot = async (
  page: any,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '.ProseMirror',
) => {
  const { tolerance, useUnsafeThreshold } = threshold;
  const editor = await page.$(selector);

  // Try to take a screenshot of only the editor.
  // Otherwise take the whole page.
  let image;
  if (editor) {
    image = await editor.screenshot();
  } else {
    image = await page.screenshot();
  }

  return compareScreenshot(image, tolerance, { useUnsafeThreshold });
};
