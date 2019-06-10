import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { comment, fullpage, editable, linkToolbar } from '../_helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

const linkText1 = 'http://hello.com ';

// https://product-fabric.atlassian.net/browse/ED-4162 - Firefox
// Floating toolbar is not showin up on IE and edge
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-toolbar.ts: Link: Empty text to display when link href is same as text`,
    {
      skip: ['ie', 'edge', 'safari', 'firefox'],
    },
    async (client: any) => {
      const textToDisplayInput = '[placeholder="Text to display"]';
      let browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await browser.waitForSelector(linkToolbar);
      await browser.waitForSelector('a');

      await browser.type(editable, [
        'Return',
        linkText1,
        'ArrowLeft',
        'ArrowLeft',
      ]);
      await browser.waitForSelector('[aria-label="Edit link"]');
      await browser.click('[aria-label="Edit link"]');

      await browser.waitForSelector(textToDisplayInput);
      const elem = await browser.getText(textToDisplayInput);
      expect(elem).toEqual('');
    },
  );
});
