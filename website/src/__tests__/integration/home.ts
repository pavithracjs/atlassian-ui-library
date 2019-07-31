import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { DESKTOP_BREAKPOINT_MIN } from '../../constants';

const urlHome = 'http://localhost:9000/';

const app = '#app';
const atlaskitLogo = '[alt="Atlaskit logo"]';
const atlaskitTitle = 'h1[data-testid="title"]';
const openNavigationButton = '[aria-label="Open navigation"]';

BrowserTestCase(
  'home.js: The website home page should be displayed without errors on desktop view',
  { skip: [] },
  async (client: any) => {
    const homeTest = new Page(client);
    await homeTest.goto(urlHome);
    // Windows is adding scrollbar due to which the width is wrecked
    // catering for the scroll bar width
    await homeTest.setWindowSize(DESKTOP_BREAKPOINT_MIN + 30, 2000);
    await homeTest.waitForSelector(app);
    const titleIsVisible = await homeTest.isVisible(atlaskitTitle);
    const titleText = await homeTest.getText(atlaskitTitle);
    const logo = await homeTest.isVisible(atlaskitLogo);

    expect(logo).toBe(true);
    expect(titleIsVisible).toBe(true);
    expect(titleText).toBe('Atlaskit');
    await homeTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'home.js: The website home page should be displayed without errors on tablet/ mobile view',
  { skip: [] },
  async (client: any) => {
    const homeTest = new Page(client);
    await homeTest.goto(urlHome);
    await homeTest.setWindowSize(DESKTOP_BREAKPOINT_MIN - 1, 2000);
    await homeTest.waitForSelector(app);
    await homeTest.waitForSelector(openNavigationButton);
    const navigationButton = await homeTest.isVisible(openNavigationButton);
    const titleIsVisible = await homeTest.isVisible(atlaskitTitle);
    const titleText = await homeTest.getText(atlaskitTitle);

    expect(navigationButton).toBe(true);
    expect(titleIsVisible).toBe(true);
    expect(titleText).toBe('Atlaskit');
    await homeTest.checkConsoleErrors();
  },
);
