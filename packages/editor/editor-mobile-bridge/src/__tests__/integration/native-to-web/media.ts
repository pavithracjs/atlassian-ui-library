import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  callNativeBridge,
  editor,
  editable,
  getDocFromElement,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `media.ts: Insert media single having dimensions`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    const uploadPreviewUpdatePayload = {
      file: {
        dimensions: {
          width: 2265,
          height: 1500,
        },
        id: 'cc6359f2-dcd6-47f9-ae22-4ac8b86cddb2',
        name: 'rose-blue-flower-rose-blooms-67636.jpeg',
        type: 'image/jpeg',
      },
      preview: {
        dimensions: {
          width: 2265,
          height: 1500,
        },
      },
    };

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(uploadPreviewUpdatePayload),
    );

    const mobileUploadEndPayload = {
      file: {
        collectionName: 'TestCollection',
        id: 'cc6359f2-dcd6-47f9-ae22-4ac8b86cddb2',
        publicId: '12d5234f-eb29-424a-84fe-36fe14a33754',
        name: 'rose-blue-flower-rose-blooms-67636.jpeg',
        type: 'image/jpeg',
      },
    };

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(mobileUploadEndPayload),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Insert media single unknown dimensions`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    const uploadPreviewUpdatePayload = {
      file: {
        id: 'dc6359f2-dcd6-47f9-ae22-4ac8b86cddb2',
        name: 'rose-blue-flower-rose-blooms-67636.jpeg',
        type: 'image/jpeg',
      },
    };

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(uploadPreviewUpdatePayload),
    );

    const mobileUploadEndPayload = {
      file: {
        collectionName: 'TestCollection',
        id: 'dc6359f2-dcd6-47f9-ae22-4ac8b86cddb2',
        publicId: 'e2d5234f-eb29-424a-84fe-36fe14a33754',
        name: 'rose-blue-flower-rose-blooms-67636.jpeg',
        type: 'image/jpeg',
      },
    };

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(mobileUploadEndPayload),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
