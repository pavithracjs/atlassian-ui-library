import { snapshot, Device, initEditorWithAdf, Appearance } from '../_utils';
import { traverse } from '@atlaskit/adf-utils/traverse';
import smartLinksAdf from './__fixtures__/smart-link-nested-in-list.adf.json';
import extensionAdf from './__fixtures__/inline-extension-inside-lists.adf.json';
import statusAdf from './__fixtures__/status-inside-lists.adf.json';
import dateAdf from './__fixtures__/date-inside-lists.adf.json';
import floatsAdf from './__fixtures__/lists-adjacent-floats-adf.json';
import floatsAdf2 from './__fixtures__/action-decision-lists-adjacent-floats-adf.json';
import {
  waitForCardToolbar,
  clickOnCard,
} from '../../__helpers/page-objects/_smart-links';
import {
  waitForExtensionToolbar,
  clickOnExtension,
} from '../../__helpers/page-objects/_extensions';
import {
  waitForStatusToolbar,
  clickOnStatus,
} from '../../__helpers/page-objects/_status';
import {
  waitForDatePicker,
  clickOnDate,
} from '../../__helpers/page-objects/_date';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { EditorTestCardProvider } from '../../../../../editor-test-helpers';

describe('Lists', () => {
  let page: any;
  const cardProvider = new EditorTestCardProvider();
  const threshold = 0.01;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page, threshold);
  });

  it('should render card toolbar on click when its nested inside lists', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: smartLinksAdf,
      device: Device.LaptopMDPI,
      editorProps: {
        UNSAFE_cards: { provider: Promise.resolve(cardProvider) },
      },
    });

    await clickOnCard(page);
    await waitForCardToolbar(page);
  });

  it('should render extension toolbar on click when its nested inside lists', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: extensionAdf,
      device: Device.LaptopMDPI,
    });

    await clickOnExtension(
      page,
      'com.atlassian.confluence.macro.core',
      'inline-eh',
    );
    await waitForExtensionToolbar(page);
  });

  it('should render status toolbar on click when its nested inside lists', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: statusAdf,
      device: Device.LaptopMDPI,
    });

    await clickOnStatus(page);
    await waitForStatusToolbar(page);
  });

  it('should render date picker on click when its nested inside lists', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: dateAdf,
      device: Device.LaptopMDPI,
    });

    await clickOnDate(page);
    await waitForDatePicker(page);
  });
});

describe('Lists adjacent floated media', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  it('action & decision lists should clear image', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: floatsAdf2,
      device: Device.LaptopMDPI,
    });
    await visualiseListItemBoundingBoxes(page);
    await page.setViewport({ width: 900, height: 1100 });
  });

  /**
   * Note:
   * Be aware that these tests injects additional CSS which will persist
   * on subsequent test runs.
   * If you test doesn't require this CSS they should be added above this
   * point in the test suite.
   */
  it('ordered list should not overlap image', async () => {
    const orderedListFloatsAdf = floatsAdf;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: orderedListFloatsAdf,
      device: Device.LaptopMDPI,
    });
    await visualiseListItemBoundingBoxes(page);
    await page.setViewport({ width: 900, height: 1100 });
  });

  it('bullet list should not overlap image', async () => {
    // Reuse ordered list ADF and replace with bullet list.
    const bulletListFloatsAdf = traverse(Object.assign({}, floatsAdf), {
      orderedList: (node: any) => {
        node.type = 'bulletList';
        return node;
      },
    });
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: bulletListFloatsAdf,
      device: Device.LaptopMDPI,
    });
    await visualiseListItemBoundingBoxes(page);
    await page.setViewport({ width: 900, height: 1100 });
  });
});

async function visualiseListItemBoundingBoxes(page: any) {
  const css = `
      li > * {
        /*
        Visualise the bounding box of list item content.
        Using green to ensure it doesn't clash with the red
        and yellow used by jest-image-snapshot.
        */
        background: rgba(0, 100, 50, 0.2);
      }
    `;
  await page.addStyleTag({ content: css });
}
