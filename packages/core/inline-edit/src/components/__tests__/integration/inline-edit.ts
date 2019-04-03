import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const inlineEditExampleUrl = getExampleUrl(
  'core',
  'inline-edit',
  'basic-usage',
);

const validationExampleUrl = getExampleUrl('core', 'inline-edit', 'validation');

/* Css selectors used for the inline edit tests */
const readViewContentWrapper = 'button[aria-label="Edit"] + div';
const input = 'input';
const editButton = 'button[aria-label="Edit"]';
const confirmButton = 'button[aria-label="Confirm"]';
const cancelButton = 'button[aria-label="Cancel"]';
const errorMessage = 'div#error-message';
const label = 'label';

BrowserTestCase(
  'The edit button should have focus after edit is confirmed by pressing Enter',
  /** Skipping safari because could not tab to editButton - should be fixed by BUILDTOOLS-63 */
  { skip: ['safari'] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);
    await inlineEditTest.click(label);

    await inlineEditTest.waitForSelector(editButton);
    await inlineEditTest.keys(['Tab', 'Enter']);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys(['Enter']);

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(true);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by clicking on the confirm button',
  /** Skipping safari because could not tab to editButton - should be fixed by BUILDTOOLS-63 */
  { skip: ['safari'] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(editButton);
    await inlineEditTest.click(label);
    await inlineEditTest.keys(['Tab', 'Enter']);

    await inlineEditTest.waitForSelector(confirmButton);
    await inlineEditTest.click(confirmButton);

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by pressing Enter, if edit view entered by mouse click',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys(['Enter']);

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit view should remain open when tab is pressed in the input and when tab is pressed on the confirm button',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    const browser = inlineEditTest.getBrowserName();

    if (browser === 'Safari') {
      await inlineEditTest.keys(['Alt', 'Tab']);
    } else {
      await inlineEditTest.keys(['Tab']);
    }
    await inlineEditTest.waitForSelector(confirmButton);
    expect(await inlineEditTest.hasFocus(confirmButton)).toBe(true);

    await inlineEditTest.keys(['Tab']);
    await inlineEditTest.waitForSelector(cancelButton);
    expect(await inlineEditTest.hasFocus(cancelButton)).toBe(true);
    expect(await inlineEditTest.isVisible(input)).toBe(true);

    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'An error message is displayed correctly',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(validationExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.click('input');
    await inlineEditTest.keys([
      'Backspace',
      'Backspace',
      'Backspace',
      'Backspace',
      'Backspace',
    ]);
    await inlineEditTest.waitForSelector(errorMessage);
    expect(await inlineEditTest.isVisible(errorMessage));

    await inlineEditTest.checkConsoleErrors();
  },
);
