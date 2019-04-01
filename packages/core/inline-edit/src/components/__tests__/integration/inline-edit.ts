import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const inlineEditExampleUrl = getExampleUrl(
  'core',
  'inline-edit',
  'basic-usage',
);

/* Css selectors used for the inline edit tests */
const readViewContentWrapper = 'button[aria-label="Edit"] + div';
const input = 'input';
const editButton = 'button[aria-label="Edit"]';
const confirmButton = 'button[aria-label="Confirm"]';
const cancelButton = 'button[aria-label="Cancel"]';

const inlineEditableTextfieldUrl = getExampleUrl(
  'core',
  'inline-edit',
  'inline-editable-textfield',
);

/** Css selectors used for the inline editable textfield tests */
const openInput = 'div#examples > div > form:nth-child(2) input';

// BrowserTestCase(
//   'The edit button should have focus after edit is confirmed by pressing Enter',
//   { skip: [] },
//   async (client: any) => {
//     const inlineEditTest = new Page(client);
//     await inlineEditTest.goto(inlineEditExampleUrl);

//     await inlineEditTest.waitForSelector(readViewContentWrapper);
//     await inlineEditTest.click(readViewContentWrapper);

//     await inlineEditTest.waitForSelector(input);
//     await inlineEditTest.keys(['Enter']);

//     await inlineEditTest.waitForSelector(editButton);
//     expect(await inlineEditTest.hasFocus(editButton)).toBe(true);
//     await inlineEditTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   'The edit button should not have focus after edit is confirmed by clicking on the confirm button',
//   { skip: [] },
//   async (client: any) => {
//     const inlineEditTest = new Page(client);
//     await inlineEditTest.goto(inlineEditExampleUrl);

//     await inlineEditTest.waitForSelector(readViewContentWrapper);
//     await inlineEditTest.click(readViewContentWrapper);

//     await inlineEditTest.waitForSelector(confirmButton);
//     await inlineEditTest.click(confirmButton);

//     await inlineEditTest.waitForSelector(editButton);
//     expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
//     await inlineEditTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   'The edit button should have focus after edit is cancelled by pressing Escape',
//   { skip: [] },
//   async (client: any) => {
//     const inlineEditTest = new Page(client);
//     await inlineEditTest.goto(inlineEditExampleUrl);

//     await inlineEditTest.waitForSelector(readViewContentWrapper);
//     await inlineEditTest.click(readViewContentWrapper);

//     await inlineEditTest.waitForSelector(input);
//     await inlineEditTest.keys(['Escape']);

//     await inlineEditTest.waitForSelector(editButton);
//     expect(await inlineEditTest.hasFocus(editButton)).toBe(true);
//     await inlineEditTest.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   'The edit button should not have focus after edit is confirmed by clicking on the cancel button',
//   { skip: [] },
//   async (client: any) => {
//     const inlineEditTest = new Page(client);
//     await inlineEditTest.goto(inlineEditExampleUrl);

//     await inlineEditTest.waitForSelector(readViewContentWrapper);
//     await inlineEditTest.click(readViewContentWrapper);

//     await inlineEditTest.waitForSelector(cancelButton);
//     await inlineEditTest.click(cancelButton);

//     await inlineEditTest.waitForSelector(editButton);
//     expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
//     await inlineEditTest.checkConsoleErrors();
//   },
// );

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
