// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSelectFields = getExampleUrl('core', 'form', 'select-fields');

/* Css selectors used for the select fields test */
const selectDefault = '.react-select__control';
const option = '.react-select__option';
const value = '.react-select__multi-value__label';
const removeButton = '.react-select__multi-value__remove';
const placeholder = '.react-select__placeholder';

BrowserTestCase(
  'Selecting one flavour on the options list and pressing the remove button should remove the flavour from the values',
  { skip: ['ie'] },
  async client => {
    const selectFieldsTest = new Page(client);
    await selectFieldsTest.goto(urlSelectFields);
    await selectFieldsTest.waitForSelector(selectDefault);
    await selectFieldsTest.click(selectDefault);
    await selectFieldsTest.click(option);
    expect(await selectFieldsTest.getText(value)).toBe('vanilla');
    await selectFieldsTest.click(removeButton);
    await selectFieldsTest.waitForVisible(placeholder, 1000, true);
    expect(await selectFieldsTest.isExisting(value)).toBe(false);
  },
);
