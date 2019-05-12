import { snapshot, Device, initEditorWithAdf, Appearance } from '../_utils';
import smartLinksAdf from './__fixtures__/smart-link-nested-in-list.adf.json';
import extensionAdf from './__fixtures__/inline-extension-inside-lists.adf.json';
import statusAdf from './__fixtures__/status-inside-lists.adf.json';
import dateAdf from './__fixtures__/date-inside-lists.adf.json';

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
