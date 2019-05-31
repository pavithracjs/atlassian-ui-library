const mockCloseMediaEditorCommand = jest.fn();
const mockUploadAnnotationCommand = jest.fn();

jest.mock('../../../../plugins/media/commands/media-editor', () => ({
  closeMediaEditor: jest.fn(() => mockCloseMediaEditorCommand),
  uploadAnnotation: jest.fn(() => mockUploadAnnotationCommand),
}));

import * as React from 'react';

import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { Context, FileIdentifier } from '@atlaskit/media-core';
import { SmartMediaEditor } from '@atlaskit/media-editor';

import { EditorView } from 'prosemirror-view';
import MediaEditor from '../../../../plugins/media/ui/MediaEditor';
import { MediaEditorState } from '../../../../plugins/media/types';
import { uploadAnnotation } from '../../../../plugins/media/commands/media-editor';

describe('media editor', () => {
  const mockContext = jest.fn<Context>(() => ({
    getImage: () => {
      return new Promise(() => {});
    },
    getImageMetadata: () => {
      return new Promise(() => {});
    },
    getImageUrl: () => {
      return new Promise(() => {});
    },
    file: {
      getFileState: () => ({
        subscribe: () => {},
      }),
    },
  }));

  const mockView = jest.fn<EditorView>(() => ({
    state: {},
    dispatch: jest.fn(),
  }));

  const identifier: FileIdentifier = {
    id: 'abc',
    mediaItemType: 'file',
    collectionName: 'xyz',
    occurrenceKey: '123',
  };

  it('renders nothing if no active editor', async () => {
    const state: MediaEditorState = {
      context: new mockContext(),
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
    wrapper.unmount();
  });

  it('renders nothing if no context', async () => {
    const state: MediaEditorState = {
      editor: {
        pos: 100,
        identifier,
      },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
    wrapper.unmount();
  });

  it('passes the media identifier to the smart editor', async () => {
    const context = new mockContext();
    const state: MediaEditorState = {
      context,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);

    expect(smartMediaEditor.prop('identifier')).toEqual(identifier);
    expect(smartMediaEditor.prop('context')).toEqual(context);

    wrapper.unmount();
  });

  it('dispatches closeMediaEditor when smart editor onClose is called', () => {
    const view = new mockView();
    const context = new mockContext();
    const state: MediaEditorState = {
      context,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onClose = smartMediaEditor.prop('onClose')!;

    onClose();
    expect(mockCloseMediaEditorCommand).toBeCalledWith(
      view.state,
      view.dispatch,
    );

    wrapper.unmount();
  });

  it('calls uploadAnnotation with the updated identifier and dimensions from smart editor', () => {
    const view = new mockView();
    const context = new mockContext();
    const state: MediaEditorState = {
      context,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onUploadStart = smartMediaEditor.prop('onUploadStart')!;

    const newIdentifier: FileIdentifier = {
      id: 'newId',
      mediaItemType: 'file',
      collectionName: 'newCollection',
      occurrenceKey: '999',
    };

    const newDimensions = { width: 128, height: 256 };

    onUploadStart(newIdentifier, newDimensions);
    expect(uploadAnnotation as jest.Mock).toBeCalledWith(
      newIdentifier,
      newDimensions,
    );

    wrapper.unmount();
  });

  it('dispatches uploadAnnotation when smart editor onUploadStart is called', () => {
    const view = new mockView();
    const context = new mockContext();
    const state: MediaEditorState = {
      context,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onUploadStart = smartMediaEditor.prop('onUploadStart')!;

    onUploadStart(
      {
        id: 'newId',
        mediaItemType: 'file',
        collectionName: 'newCollection',
        occurrenceKey: '999',
      },
      { width: 128, height: 256 },
    );
    expect(mockUploadAnnotationCommand).toBeCalledWith(
      view.state,
      view.dispatch,
    );

    wrapper.unmount();
  });
});
