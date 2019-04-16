import { Page } from './_types';

type KeyboardKey =
  | 'ArrowRight'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Shift'
  | 'Return'
  | 'Enter'
  | 'Backspace';

// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#keyboardpresskey-options
type KeyPressOptions = {
  // Time to wait between keydown and keyup in milliseconds. Defaults to 0.
  delay?: number;
  // If specified, generates an input event with this text.
  text?: string;
};

// Default 5ms delay between key presses to reduce test flakiness
export async function pressKey(
  page: Page,
  key: KeyboardKey | KeyboardKey[],
  options: KeyPressOptions = { delay: 5 },
) {
  const keys = Array.isArray(key) ? key : [key];

  for (let key of keys) {
    await page.keyboard.press(key, options);
  }
}

export async function pressKeyDown(page: Page, key: KeyboardKey) {
  await page.keyboard.down(key);
}

export async function pressKeyUp(page: Page, key: KeyboardKey) {
  await page.keyboard.up(key);
}
