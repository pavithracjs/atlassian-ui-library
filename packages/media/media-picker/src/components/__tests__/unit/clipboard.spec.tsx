import * as React from 'react';

jest.mock('../../../service/uploadServiceImpl');

import { MockFile, fakeMediaClient } from '@atlaskit/media-test-helpers';
import { LocalFileSource } from '../../../service/types';
import { Clipboard as ClipboardComponent } from '../../clipboard/clipboard';
import { mount, ReactWrapper } from 'enzyme';

describe('Clipboard', () => {
  let clipboard: ReactWrapper<ClipboardComponent>;
  let addFilesWithSourceSpy: any;
  let clipboardInstance: ClipboardComponent;
  let eventsMap: any;

  const mediaClient = fakeMediaClient();

  const config = {
    uploadParams: {},
  };

  beforeEach(() => {
    eventsMap = {};
    jest.spyOn(document, 'addEventListener').mockImplementation((event, cb) => {
      eventsMap[event] = cb;
    });

    clipboard = mount(
      <ClipboardComponent mediaClient={mediaClient} config={config} />,
    );

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
    // simulate paste event on document object
    eventsMap.paste(event);

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

    // simulate paste event on document object
    eventsMap.paste(event);

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
    // simulate paste event on document object
    eventsMap.paste(event);
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
    // simulate paste event on document object
    eventsMap.paste(event);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].file,
    ).toEqual(mockFile);
    expect(
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].source,
    ).toEqual(LocalFileSource.PastedScreenshot);
  });

  it('should remove event handler only when there are no more clipboard instances left', () => {
    const mockFile = new MockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile],
        types: [],
      },
    };

    const anotherClipboard = mount(
      <ClipboardComponent mediaClient={mediaClient} config={config} />,
    );
    clipboardInstance = anotherClipboard.instance() as ClipboardComponent;
    const anotherAddFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    // simulate paste event on document object
    eventsMap.paste(event);

    // first clipboard event handler is not called because we only call the last subscriber
    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(0);
    // second clipboard event handler is called as expected
    expect(anotherAddFilesWithSourceSpy).toHaveBeenCalledTimes(1);

    // we unmount second clipboard in order to make the first one "active"
    anotherClipboard.unmount();

    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
  });
});
