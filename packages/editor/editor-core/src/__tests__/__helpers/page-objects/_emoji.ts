import { Page } from './_types';

const emojiReadySelector = '.emoji-common-emoji-sprite';

export async function waitForEmojis(page: Page) {
  await page.waitForSelector(emojiReadySelector);
}
