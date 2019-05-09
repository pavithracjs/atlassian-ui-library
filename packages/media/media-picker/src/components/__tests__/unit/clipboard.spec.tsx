import * as React from 'react';

jest.mock('../../../service/newUploadServiceImpl');

import { ContextFactory } from '@atlaskit/media-core';
import { MockFile } from '@atlaskit/media-test-helpers';
import { LocalFileSource } from '../../../service/types';
import { Clipboard as ClipboardComponent } from '../../clipboard';
import { Clipboard } from '../../types';
import { mount, ReactWrapper } from 'enzyme';

describe('Clipboard', () => {
  let clipboard: ReactWrapper<Clipboard>;
  let addFilesWithSourceSpy: any;
  let clipboardInstance: ClipboardComponent;

  const context = ContextFactory.create({
    authProvider: {} as any,
  });

  const config = {
    uploadParams: {},
  };

  beforeEach(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    clipboard = mount(<ClipboardComponent context={context} config={config} />);

    clipboardInstance = clipboard.instance() as ClipboardComponent;
    addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file', () => {
    const event: any = {
      clipboardData: {
        files: [new MockFile()],
        types: [],
      },
    };
    clipboardInstance.handleEvent(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with multiple files', () => {
    const mockFile1 = new MockFile();
    const mockFile2 = new MockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile1, mockFile2],
        types: [],
      },
    };

    clipboardInstance.handleEvent(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].file,
    ).toEqual(mockFile1);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*2nd item*/[1].file,
    ).toEqual(mockFile2);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].source,
    ).toEqual(LocalFileSource.PastedFile);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*2nd item*/[1].source,
    ).toEqual(LocalFileSource.PastedFile);
  });

  it('should not trigger errors when event.clipboardData is undefined', () => {
    const event: any = {};
    clipboardInstance.handleEvent(event);
    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(0);
  });

  it('should detect pasted screenshots from clipboard event data', () => {
    const mockFile = new MockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile],
        types: ['some-type'],
      },
    };
    clipboardInstance.handleEvent(event);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].file,
    ).toEqual(mockFile);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].source,
    ).toEqual(LocalFileSource.PastedScreenshot);
  });
});
