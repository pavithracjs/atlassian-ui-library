import { Page } from './_types';

const selectors = {
  gapCursor: '.ProseMirror-gapcursor',
};

export async function waitForGapCursor(page: Page) {
  await page.waitForSelector(selectors.gapCursor);
}
