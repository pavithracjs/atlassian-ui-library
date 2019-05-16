jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(),
}));

import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  asMock,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
  fakeContext,
  getDefaultContextConfig,
} from '@atlaskit/media-test-helpers';
import { Shortcut } from '@atlaskit/media-ui';
import ModalDialog, { ModalProps } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import {
  Context,
  FileState,
  UploadableFile,
  FileIdentifier,
  AuthProvider,
} from '@atlaskit/media-core';
import uuidV4 from 'uuid/v4';
import { TouchedFiles, UploadableFileUpfrontIds } from '@atlaskit/media-store';
import {
  SmartMediaEditor,
  SmartMediaEditorProps,
  SmartMediaEditorState,
  convertFileNameToPng,
} from '../smartMediaEditor';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import EditorView, { EditorViewProps } from '../editorView/editorView';
import ErrorView, { ErrorViewProps } from '../editorView/errorView/errorView';
import { Blanket } from '../styled';

describe('Smart Media Editor', () => {
  let fileIdPromise: Promise<string>;
  let fileId: string;
  let fileIdentifier: FileIdentifier;
  let onFinish: SmartMediaEditorProps['onFinish'];
  let onUploadStart: SmartMediaEditorProps['onUploadStart'];
  let context: Context;
  let component: ShallowWrapper<SmartMediaEditorProps, SmartMediaEditorState>;
  let givenFileStateObservable: ReplaySubject<FileState>;
  let formatMessage: jest.Mock<any>;

  beforeEach(() => {
    formatMessage = jest
      .fn()
      .mockImplementation((message: any) => message.defaultMessage);
    const fakeIntl: any = { formatMessage };
    fileId = 'some-file-id';
    fileIdPromise = Promise.resolve(fileId);
    fileIdentifier = {
      id: fileIdPromise,
      mediaItemType: 'file',
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    };
    onFinish = jest.fn();
    onUploadStart = jest.fn();
    context = fakeContext();
    givenFileStateObservable = new ReplaySubject<FileState>(1);
    asMock(context.file.getFileState).mockReturnValue(givenFileStateObservable);

    component = shallow(
      <SmartMediaEditor
        context={context}
        identifier={fileIdentifier}
        onFinish={onFinish}
        onUploadStart={onUploadStart}
        intl={fakeIntl}
      />,
    );

    (uuidV4 as jest.Mock<{}>)
      .mockReturnValueOnce('uuid1')
      .mockReturnValueOnce('uuid2')
      .mockReturnValueOnce('uuid3')
      .mockReturnValueOnce('uuid4');
  });

  afterEach(() => {
    (uuidV4 as jest.Mock<{}>).mockReset();
    jest.restoreAllMocks();
  });

  it('should call onFinish when escape pressed', () => {
    const shortcut = component.find(Shortcut);
    const { keyCode, handler } = shortcut.props();
    expectToEqual(keyCode, 27);
    handler();
    expect(onFinish).toHaveBeenCalled();
  });

  it('should display spinner on initial render', () => {
    expect(component.find(Spinner)).toHaveLength(1);
  });

  it('should pass click even through Blanket', () => {
    const stopPropagation = jest.fn();
    component.find(Blanket).simulate('click', { stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should call getFileState for given file', async () => {
    const { collectionName, occurrenceKey } = fileIdentifier;
    await fileIdPromise;
    expectFunctionToHaveBeenCalledWith(context.file.getFileState, [
      fileId,
      {
        collectionName,
        occurrenceKey,
      },
    ]);
  });

  const forFileToBeProcessed = async () => {
    const imageUrlPromise = Promise.resolve('some-image-url');
    asMock(context.getImageUrl).mockReturnValue(imageUrlPromise);
    givenFileStateObservable.next({
      status: 'processed',
      id: fileId,
      occurrenceKey: 'some-occurrence-key',
      mediaType: 'image',
      mimeType: 'image/gif',
      name: 'some-name',
      size: 42,
      artifacts: {},
      representations: {},
    });
    await fileIdPromise;
    await imageUrlPromise;
    component.update();
  };

  describe('when incoming file is processed', () => {
    beforeEach(async () => {
      await forFileToBeProcessed();
    });

    it('should render EditorView', async () => {
      const editorView = component.find<EditorViewProps>(EditorView);
      expect(editorView).toHaveLength(1);
      const { imageUrl } = editorView.props();
      expectToEqual(imageUrl, 'some-image-url');
    });

    it('should call context.getImageUrl', () => {
      expectFunctionToHaveBeenCalledWith(context.getImageUrl, [
        fileId,
        {
          collection: fileIdentifier.collectionName,
          mode: 'full-fit',
        },
      ]);
    });

    it('should not listen for farther file states', async () => {
      // Wait for observable unsubscription
      await new Promise(resolve => setTimeout(resolve, 0));
      givenFileStateObservable.next({
        status: 'error',
        id: fileId,
        occurrenceKey: 'some-occurrence-key',
      });
      component.update();
      expect(component.find('ErrorView')).toHaveLength(0);
      expect(component.find(EditorView)).toHaveLength(1);
    });
  });

  describe('onSave callback', () => {
    let resultingFileStateObservable: ReplaySubject<FileState>;
    const callEditorViewOnSaveWithCustomContext = (customContext: Context) => {
      resultingFileStateObservable = new ReplaySubject<FileState>(1);
      const touchedFiles: TouchedFiles = {
        created: [
          {
            fileId: 'some-file-id',
            uploadId: 'some-upload-id',
          },
        ],
      };
      asMock(customContext.file.touchFiles).mockResolvedValue(touchedFiles);
      asMock(customContext.file.upload).mockReturnValue(
        resultingFileStateObservable,
      );
      const editorView = component.find<EditorViewProps>(EditorView);
      const { onSave } = editorView.props();
      onSave('some-image-content', { width: 200, height: 100 });
    };

    describe('when EditorView calls onSave with userAuthProvider', () => {
      let userAuthProvider: AuthProvider;
      beforeEach(async () => {
        await forFileToBeProcessed();
        const defaultConfig = getDefaultContextConfig();
        userAuthProvider = jest.fn() as any;
        const config = {
          ...defaultConfig,
          userAuthProvider,
        };
        context = fakeContext({}, config);
        component.setProps({
          context,
        });
        callEditorViewOnSaveWithCustomContext(context);
      });

      it('should call context.file.copyFile', async () => {
        resultingFileStateObservable.next({
          status: 'processing',
          id: 'uuid1',
          mediaType: 'image',
          mimeType: 'image/gif',
          name: 'some-name',
          size: 42,
          representations: {},
        });
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(context.file.copyFile).toHaveBeenCalledTimes(1);
        expectFunctionToHaveBeenCalledWith(context.file.copyFile, [
          {
            id: 'uuid1',
            collection: fileIdentifier.collectionName,
            authProvider: context.config.authProvider,
          },
          {
            collection: 'recents',
            authProvider: userAuthProvider,
            occurrenceKey: 'uuid3',
          },
        ]);
      });
    });

    describe('when EditorView calls onSave without userAuthProvider', () => {
      beforeEach(async () => {
        await forFileToBeProcessed();
        callEditorViewOnSaveWithCustomContext(context);
      });

      it('should upload a file', async () => {
        // First we touch files with client generated id
        expectFunctionToHaveBeenCalledWith(context.file.touchFiles, [
          [
            {
              fileId: 'uuid1',
              collection: fileIdentifier.collectionName,
              occurrenceKey: 'uuid2',
            },
          ],
          fileIdentifier.collectionName,
        ]);

        // Then we call upload
        const expectedUploadableFile: UploadableFile = {
          content: 'some-image-content',
          name: 'some-name.png',
          collection: fileIdentifier.collectionName,
        };
        const expectedUploadableFileUpfrontIds: UploadableFileUpfrontIds = {
          id: 'uuid1',
          deferredUploadId: expect.anything(),
          occurrenceKey: 'uuid2',
        };
        expectFunctionToHaveBeenCalledWith(context.file.upload, [
          expectedUploadableFile,
          undefined,
          expectedUploadableFileUpfrontIds,
        ]);
        const actualUploadableFileUpfrontIds: UploadableFileUpfrontIds = asMock(
          context.file.upload,
        ).mock.calls[0][2];
        const actualUploadId = await actualUploadableFileUpfrontIds.deferredUploadId;
        expectToEqual(actualUploadId, 'some-upload-id');

        // In the end we exit synchronously with new identifier
        expectFunctionToHaveBeenCalledWith(onUploadStart, [
          {
            mediaItemType: 'file',
            id: 'uuid1',
            collectionName: fileIdentifier.collectionName,
            occurrenceKey: 'uuid2',
          },
          {
            width: 200,
            height: 100,
          },
        ]);
      });

      describe('when new file is fully uploaded (processing)', () => {
        it('should call onFinish', async () => {
          resultingFileStateObservable.next({
            status: 'processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            representations: {},
          });
          await new Promise(resolve => setTimeout(resolve, 0));
          resultingFileStateObservable.next({
            status: 'processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            representations: {},
          });
          expect(onFinish).toHaveBeenCalledTimes(1);
        });
      });

      it('should show error screen when processing-failed', async () => {
        asMock(formatMessage).mockReturnValue('Error message');
        resultingFileStateObservable.next({
          status: 'failed-processing',
          id: 'uuid1',
          mediaType: 'image',
          mimeType: 'image/gif',
          name: 'some-name',
          size: 42,
          artifacts: [],
          representations: {},
        });
        component.update();
        expect(component.find(EditorView)).toHaveLength(0);
        expect(component.find(ErrorView)).toHaveLength(1);
        const errorViewProps = component
          .find<ErrorViewProps>(ErrorView)
          .props();
        expectToEqual(errorViewProps.message, 'Error message');
      });

      it('should show error screen when error', async () => {
        asMock(formatMessage).mockReturnValue('Error message');
        resultingFileStateObservable.next({
          status: 'error',
          id: 'uuid1',
        });
        component.update();
        expect(component.find(EditorView)).toHaveLength(0);
        expect(component.find(ErrorView)).toHaveLength(1);
        const errorViewProps = component
          .find<ErrorViewProps>(ErrorView)
          .props();
        expectToEqual(errorViewProps.message, 'Error message');
      });

      it('should close editor when error is dismissed', () => {
        resultingFileStateObservable.next({
          status: 'failed-processing',
          id: 'uuid1',
          mediaType: 'image',
          mimeType: 'image/gif',
          name: 'some-name',
          size: 42,
          artifacts: [],
          representations: {},
        });
        component.update();
        const errorViewProps = component
          .find<ErrorViewProps>(ErrorView)
          .props();
        errorViewProps.onCancel();
        expect(onFinish).toHaveBeenCalled();
      });
    });
  });

  describe('when changes has been made and cancel is pressed', () => {
    let modalDialog: ShallowWrapper<ModalProps>;

    beforeEach(async () => {
      await forFileToBeProcessed();
      const editorView = component.find<EditorViewProps>(EditorView);
      const { onAnyEdit, onCancel } = editorView.props();
      onAnyEdit!();
      onCancel();
      modalDialog = component.find(ModalDialog);
    });

    it('should show confirmation dialog when user cancels', () => {
      expect(modalDialog).toHaveLength(1);
      expect(modalDialog.prop('heading')).toEqual('Unsaved changes');
    });

    it('should call onFinish when first action is chosen', () => {
      const firstAction = (modalDialog.prop('actions') as any)[0];
      expect(firstAction.text).toEqual('Close anyway');
      firstAction.onClick();
      expect(onFinish).toHaveBeenCalled();
    });

    it('should just close confirmation dialog and not call onFinish when second action is chosen', () => {
      const secondAction = (modalDialog.prop('actions') as any)[1];
      expect(secondAction.text).toEqual('Cancel');
      secondAction.onClick();
      expect(onFinish).not.toHaveBeenCalled();
      modalDialog = component.find(ModalDialog);
      expect(modalDialog).toHaveLength(0);
    });
  });

  describe('#convertFileNameToPng()', () => {
    it('should return default value if undefined', () => {
      expect(convertFileNameToPng(undefined)).toEqual('annotated-image.png');
    });

    it('should return default value if empty', () => {
      expect(convertFileNameToPng('')).toEqual('annotated-image.png');
    });

    it('should replace anything that looks like an extension with .png', () => {
      expect(convertFileNameToPng('some.image')).toEqual('some.png');
    });

    it('should replace anything that looks like an extension with .png if starts with a dot', () => {
      expect(convertFileNameToPng('.some.other.image')).toEqual(
        '.some.other.png',
      );
    });

    it('should append .png if nothing looks like an extension', () => {
      expect(convertFileNameToPng('somethingElse')).toEqual(
        'somethingElse.png',
      );
    });

    it('should append .png if nothing looks like an extension if starts with a dot', () => {
      expect(convertFileNameToPng('.some')).toEqual('.some.png');
    });

    it('should append .png if nothing looks like an extension if ends with a dot', () => {
      expect(convertFileNameToPng('.some.stuff.')).toEqual('.some.stuff.png');
    });
  });
});
