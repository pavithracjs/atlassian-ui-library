import { insertMedia as integrationInsertMedia } from '../../integration/_helpers';
import { Page } from './_types';
import { getBoundingRect, scrollToElement } from './_editor';

import { snapshot } from '../../visual-regression/_utils';
import commonMessages, { linkToolbarMessages } from '../../../messages';
import { messages as mediaLayoutToolbarMessages } from '../../../plugins/media/toolbar/buildMediaLayoutButtons';
import { mediaLinkToolbarMessages } from '../../../plugins/media/ui/MediaLinkingToolbar';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { mediaSingleClassName } from '@atlaskit/editor-common';

export enum MediaLayout {
  center,
  wrapLeft,
  wrapRight,
  wide,
  fullWidth,
  alignStart,
  alignEnd,
}

export const mediaSingleLayouts = [
  MediaLayout.center,
  MediaLayout.alignEnd,
  MediaLayout.alignStart,
  MediaLayout.wrapLeft,
  MediaLayout.wrapRight,
  MediaLayout.fullWidth,
  MediaLayout.wide,
];

export enum MediaResizeSide {
  right = 'right',
  left = 'left',
}

export enum MediaToolbarButton {
  addLink,
  editLink,
  openLink,
  backLink,
  unlink,
}

// Selectors
const mediaUploadCardSelector = '.e2e-recent-upload-card';
const mediaImageSelector = `.${mediaSingleClassName} .img-wrapper, .mediaGroupView-content-wrap .img-wrapper`;
const mediaImageSelected = `.ProseMirror-selectednode .${mediaSingleClassName} .img-wrapper, .ProseMirror-selectednode .mediaGroupView-content-wrap .img-wrapper`;
const insertMediaFileSelector = 'div[aria-label="%s"]';

export const LinkToolbarSelectors = {
  [MediaToolbarButton.addLink]: `[aria-label="Media floating controls"] [aria-label="${
    linkToolbarMessages.addLink.defaultMessage
  }"]`,
  [MediaToolbarButton.editLink]: `[aria-label="Media floating controls"] [aria-label="${
    linkToolbarMessages.editLink.defaultMessage
  }"]`,
  [MediaToolbarButton.openLink]: `[aria-label="Media floating controls"] [aria-label="${
    linkToolbarMessages.openLink.defaultMessage
  }"]`,
  [MediaToolbarButton.unlink]: `[aria-label="Media floating controls"] [aria-label="${
    linkToolbarMessages.unlink.defaultMessage
  }"]`,
  [MediaToolbarButton.backLink]: `[aria-label="Media floating controls"] [aria-label="${
    mediaLinkToolbarMessages.backLink.defaultMessage
  }"]`,
};

const LayoutSelectors = {
  [MediaLayout.center]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      commonMessages.alignImageCenter.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-center`,
  },
  [MediaLayout.wrapLeft]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      mediaLayoutToolbarMessages.wrapLeft.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-wrap-left`,
  },
  [MediaLayout.wrapRight]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      mediaLayoutToolbarMessages.wrapRight.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-wrap-right`,
  },
  [MediaLayout.wide]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      commonMessages.layoutWide.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-wide`,
  },
  [MediaLayout.fullWidth]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      commonMessages.layoutFullWidth.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-full-width`,
  },
  [MediaLayout.alignStart]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      commonMessages.alignImageLeft.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-align-start`,
  },
  [MediaLayout.alignEnd]: {
    button: `[aria-label="Media floating controls"] [aria-label="${
      commonMessages.alignImageRight.defaultMessage
    }"]`,
    modifier: `.${mediaSingleClassName}.image-align-end`,
  },
};

const mediaResizeSelectors = {
  [MediaResizeSide.right]: '.mediaSingle-resize-handle-right',
  [MediaResizeSide.left]: '.mediaSingle-resize-handle-left',
};

export async function waitForMediaToBeLoaded(page: Page) {
  await page.waitForSelector(mediaImageSelector);
  await page.waitForSelector(mediaUploadCardSelector, {
    // We need to wait for the upload card to disappear
    hidden: true,
  });
}

export const scrollToMedia = async (page: Page) => {
  await scrollToElement(page, mediaImageSelector, 50);
};

export const insertMedia = async (page: Page, filenames = ['one.svg']) => {
  // We need to wrap this as the xpath selector used in integration tests
  // isnt valid in puppeteer
  await integrationInsertMedia(page, filenames, insertMediaFileSelector);
  await waitForMediaToBeLoaded(page);
};

export async function clickOnToolbarButton(
  page: Page,
  button: MediaToolbarButton,
) {
  const selector = LinkToolbarSelectors[button];

  await page.waitForSelector(selector);
  await page.click(selector);
}

export async function waitForActivityItems(page: Page, items: number) {
  const itemsSelector = `[aria-label="Media floating controls"] .recent-list ul li`;
  await page.waitFor(
    (selector: string, items: number) =>
      document.querySelectorAll(selector).length === items,
    {},
    itemsSelector,
    items,
  );
  await waitForLoadedImageElements(page, 3000);
}

export async function changeMediaLayout(page: Page, layout: MediaLayout) {
  const { button, modifier } = LayoutSelectors[layout];

  await page.waitForSelector(button);
  await page.click(button);

  await page.waitForSelector(modifier);
}

export async function clickMediaInPosition(page: Page, position: number) {
  await page.evaluate(
    (position: number, mediaImageSelector: string) => {
      (document.querySelectorAll(mediaImageSelector)[
        position
      ]! as HTMLElement).click();
    },
    position,
    mediaImageSelector,
  );
  await page.waitForSelector(mediaImageSelected);
}

const pickupHandle = async (
  page: Page,
  side: MediaResizeSide = MediaResizeSide.right,
) => {
  let rect = await getBoundingRect(page, mediaResizeSelectors[side]);

  const resizeHandle = rect.left + rect.width / 2;
  const top = rect.top + rect.height / 2;

  await page.mouse.move(resizeHandle, top);
  await page.mouse.down();
};

const moveHandle = async (
  page: Page,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) => {
  let rect = await getBoundingRect(page, mediaResizeSelectors[side]);

  const resizeHandle = rect.left + rect.width / 2;
  const top = rect.top + rect.height / 2;

  await page.mouse.move(resizeHandle + distance, top);
};

export const releaseHandle = async (page: Page) => {
  await page.mouse.up();
};
export async function resizeMediaInPositionWithSnapshot(
  page: Page,
  position: number,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) {
  await clickMediaInPosition(page, position);
  await pickupHandle(page, side);

  await moveHandle(page, distance, side);

  await releaseHandle(page);

  await pickupHandle(page, side);
  await snapshot(page);
}

export async function resizeMediaInPosition(
  page: Page,
  position: number,
  distance: number,
  side: MediaResizeSide = MediaResizeSide.right,
) {
  await clickMediaInPosition(page, position);
  await pickupHandle(page, side);
  await moveHandle(page, distance, side);
  await releaseHandle(page);
}

export const isLayoutAvailable = (
  mode: MediaLayout.wide | MediaLayout.fullWidth,
  width: number,
) => {
  if (mode === MediaLayout.wide) {
    return width >= 960;
  } else if (mode === MediaLayout.fullWidth) {
    return width >= 1280;
  }

  return true;
};

export type TestPageConfig = {
  viewport: {
    width: number;
    height: number;
  };

  dynamicTextSizing: boolean;
};
