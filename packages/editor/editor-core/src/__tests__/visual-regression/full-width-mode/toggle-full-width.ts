import {
  initFullPageEditorWithAdf,
  Device,
  snapshot,
  updateEditorProps,
} from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import mixedContentAdf from './__fixtures__/mixed-content.adf.json';
import layoutWithBreakoutAdf from './__fixtures__/layout-with-breakout.adf.json';
import breakoutAdf from './__fixtures__/mixed-content-with-breakout.adf.json';
import mediaAdf from './__fixtures__/media-single.adf.json';
import resizedTableAdf from './__fixtures__/resized-table.adf.json';
import resizedTableWideAdf from './__fixtures__/resized-table-wide.adf.json';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Snapshot Test: Toggle between full-width and default mode', () => {
  let page: Page;
  let fullWidthMode: boolean;

  const initEditor = async (adf: Object) => {
    fullWidthMode = false;
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopHiDPI,
      undefined,
      undefined,
      undefined,
      { transition: true },
    );
  };

  const toggleFullWidthProp = async () => {
    fullWidthMode = !fullWidthMode;
    await updateEditorProps(page, {
      appearance: fullWidthMode ? 'full-width' : 'full-page',
    });
    await page.waitFor(1000); // wait for transition to complete
    await snapshot(page, 0.02);
  };

  const toggleFullWidthMode = async () => {
    // go from default -> full-width
    await toggleFullWidthProp();
    // then from full-width -> default
    await toggleFullWidthProp();
  };

  beforeEach(() => {
    // @ts-ignore
    page = global.page;
  });

  it('displays content correctly', async () => {
    await initEditor(mixedContentAdf);
    await toggleFullWidthMode();
  });

  describe('Breakout', () => {
    const codeSelector = '.code-block';
    it('hides breakout buttons in full-width mode and shows them in default mode', async () => {
      await initEditor(breakoutAdf);
      await page.click(codeSelector);
      await toggleFullWidthMode();
    });

    it('handles breakout mode + gap cursor', async () => {
      const panelContentSelector = '.ak-editor-panel__content';
      await initEditor(layoutWithBreakoutAdf);
      await page.click(panelContentSelector);
      await pressKey(page, ['ArrowRight']);
      await toggleFullWidthProp();
    });
  });

  describe('Media', () => {
    it('resizes image correctly', async () => {
      await initEditor(mediaAdf);
      await toggleFullWidthMode();
    });
  });

  describe('Table resizing', () => {
    it('scales column correctly', async () => {
      await initEditor(resizedTableAdf);
      await toggleFullWidthMode();
    });

    it('scales a wide layout table through modes correctly', async () => {
      await initEditor(resizedTableWideAdf);
      await toggleFullWidthMode();
    });
  });
});
