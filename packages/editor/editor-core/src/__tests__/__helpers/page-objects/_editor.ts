import { Page } from './_types';

export const selectors = {
  editor: '.ProseMirror',
  selectedNode: '.ProseMirror-selectednode',
  scrollContainer: '.fabric-editor-popup-scroll-parent',
  dropList: 'div[data-role="droplistContent"]',
  emojiPicker: 'div[data-emoji-picker-container="true"]',
  mentionQuery: 'span[data-type-ahead-query]',
  gapCursor: '.ProseMirror-gapcursor',
  layoutDataSection: '[data-layout-section="true"]',
  panelContent: '.ak-editor-panel__content',
  codeContent: '.code-content',
};

export const MINIMUM_ACCEPTABLE_TOLERANCE = 0.02;

export async function clickEditableContent(page: Page) {
  await page.waitForSelector(selectors.editor);
  await page.click(selectors.editor);
}

const replaceInputStr = (str: string) => {
  return `concat('${str.replace(/'/g, `', "'", '`)}', '')`;
};

const getElementPathWithText = (text: string, htmlTag: string = 'span') =>
  `//${htmlTag}[contains(text(), ${replaceInputStr(text)})]`;

export const waitForElementWithText = async (
  page: Page,
  text: string,
  htmlTag = 'span',
) => {
  const elementPath = getElementPathWithText(text, htmlTag);
  await page.waitForXPath(elementPath, 5000);
};

export const clickElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: any;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  await page.waitForXPath(elementPath, 5000);
  const target = await page.$x(elementPath);
  expect(target.length).toBeGreaterThan(0);
  await target[0].click();
};

export const getBoundingRect = async (page: any, selector: string) => {
  return await page.evaluate((selector: string) => {
    const element = document.querySelector(selector)!;
    const { x, y, width, height } = element.getBoundingClientRect() as DOMRect;
    return { left: x, top: y, width, height, id: element.id };
  }, selector);
};

// Execute the click using page.evaluate
// There appears to be a bug in Puppeteer which causes the
// "Node is either not visible or not an HTMLElement" error.
// https://product-fabric.atlassian.net/browse/ED-5688
export const evaluateClick = (page: any, selector: string) => {
  return page.evaluate((selector: string) => {
    (document.querySelector(selector)! as HTMLElement).click();
  }, selector);
};

export async function animationFrame(page: any) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}

export async function typeInEditor(page: Page, text: string) {
  await page.click(selectors.editor);
  await page.type(selectors.editor, text);
}

export async function typeInEditorAtEndOfDocument(page: Page, text: string) {
  // To find the end of the document in a content agnostic way we click beneath
  // the last content node to insert a new paragaph prior to typing.
  // Complex node structures which support nesting (e.g. tables) make standard
  // clicking, focusing, and key pressing not suitable in an agnostic way.
  const bounds = await getBoundingRect(
    page,
    `${selectors.editor} > *:last-child`,
  );
  await page.mouse.click(bounds.left, bounds.top + bounds.height + 5);
  await page.type(`${selectors.editor} > p:last-child`, text);
}

export async function getEditorWidth(page: Page) {
  return page.$eval(selectors.editor, (el: HTMLElement) => el.clientWidth);
}
