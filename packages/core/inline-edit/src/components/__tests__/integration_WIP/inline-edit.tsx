import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlFormCreateRepo = getExampleUrl('core', 'inline-edit', 'basic-usage');

/* Css selectors used for the repository form test */
// const createForm = 'form[name="create-repo"]';
// const owner = 'div#owner-select';
// const project = 'div#project-select';
// const repoName = 'input[name="repo-name"]';
// const accessLevel = 'input[type="checkbox"][name="access-level"]';
// const includeReadme = 'div#include-readme-select';
// const createRepoBtn = 'button[type="submit"]#create-repo-button';
// const cancelBtn = 'button[type="button"]#create-repo-cancel';

// BrowserTestCase(
//   'Create repository form should render without errors',
//   { skip: [] },
//   async client => {
//     const formTest = new Page(client);
//     await formTest.goto(urlFormCreateRepo);
//     await formTest.waitForSelector(createForm);
//     const ownerIsVisible = await formTest.isVisible(owner);
//     const projectIsVisible = await formTest.isVisible(project);
//     const repoNameIsVisible = await formTest.isVisible(repoName);
//     const accessLevelIsVisible = await formTest.isExisting(accessLevel);
//     const includeReadmeIsVisible = await formTest.isVisible(includeReadme);
//     const createRepoBtnIsVisible = await formTest.isVisible(createRepoBtn);
//     const cancelBtnIsVisible = await formTest.isVisible(cancelBtn);
//     expect(ownerIsVisible).toBe(true);
//     expect(projectIsVisible).toBe(true);
//     expect(repoNameIsVisible).toBe(true);
//     expect(accessLevelIsVisible).toBe(true);
//     expect(includeReadmeIsVisible).toBe(true);
//     expect(createRepoBtnIsVisible).toBe(true);
//     expect(cancelBtnIsVisible).toBe(true);
//     await formTest.checkConsoleErrors();
//   },
// );

// it('should focus on edit button after editing mode is closed', () => {
//   const wrapper = mount(
//     <InlineEditableTextfield
//       onConfirm={noop}
//       defaultValue=""
//       startWithEditViewOpen
//     />,
//   );
//   wrapper.find('form').simulate('submit');
//   console.log(wrapper.find(EditButton).debug());
//   console.log(document.activeElement);
//   // expect(wrapper.find(EditButton).matchesElement()
// });

// it('should not focus on edit button when mouse is used to confirm', () => {

// });

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
