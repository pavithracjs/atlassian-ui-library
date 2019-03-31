import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const inlineEditExampleUrl = getExampleUrl(
  'core',
  'inline-edit',
  'basic-usage',
);

/* Css selectors used for the repository form test */
const readViewContentWrapper = 'button[aria-label="Edit"] + div';
const input = 'input';
const editButton = 'button[aria-label="Edit"]';
const confirmButton = 'button[aria-label="Confirm"]';
const cancelButton = 'button[aria-label="Cancel"]';

BrowserTestCase(
  'The edit button should have focus after edit is confirmed by pressing Enter',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys(['Enter']);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    const borderProperty = await inlineEditTest.getProperty(
      readViewContentWrapper,
      'border',
    );
    expect(borderProperty.value).toBe('2px solid rgb(76, 154, 255)');
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should have focus after edit is cancelled by pressing Escape',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys(['Escape']);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    const borderProperty = await inlineEditTest.getProperty(
      readViewContentWrapper,
      'border',
    );
    expect(borderProperty.value).toBe('2px solid rgb(76, 154, 255)');
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by clicking on the confirm button',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(confirmButton);
    await inlineEditTest.click(confirmButton);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    const borderProperty = await inlineEditTest.getProperty(
      readViewContentWrapper,
      'border',
    );
    expect(borderProperty.value).toBe('2px solid rgba(0, 0, 0, 0)');
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by clicking on the cancel button',
  { skip: [] },
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(cancelButton);
    await inlineEditTest.click(cancelButton);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    const borderProperty = await inlineEditTest.getProperty(
      readViewContentWrapper,
      'border',
    );
    expect(borderProperty.value).toBe('2px solid rgba(0, 0, 0, 0)');
    await inlineEditTest.checkConsoleErrors();
  },
);

// it('should stay in edit view when tab is pressed in the input and the confirm button', () => {
//   const spy = jest.fn();
//   const wrapper = mount(
//     <InlineEditableTextfield
//       onConfirm={spy}
//       defaultValue=""
//       startWithEditViewOpen
//     />,
//   );
//   const input = wrapper.find('input');
//   input.simulate('keyDown', { key: 'Tab' });
//   expect(wrapper.find('input').length).toBe(1);
//   expect(spy).not.toBeCalled();
//   expect(wrapper.find('input').prop('value')).toBe('');
// });

// it('should focus automatically on editView when startWithEditViewOpen prop is true', () => {

// });

// it('should focus automatically on editView when readView is clicked', () => {

// });
