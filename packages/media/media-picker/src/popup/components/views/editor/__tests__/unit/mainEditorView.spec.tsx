import * as React from 'react'; // eslint-disable-line
import { Component } from 'react';
import { shallow } from 'enzyme';
import { EditorView } from '@atlaskit/media-editor';
import {
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
} from '@atlaskit/media-test-helpers';
import {
  MainEditorView,
  MainEditorViewDispatchProps,
  MainEditorViewStateProps,
} from '../../mainEditorView';
import { ErrorView } from '../../errorView/errorView';
import { SpinnerView } from '../../spinnerView/spinnerView';

describe('MainEditorView', () => {
  class FakeEditorView extends Component<{}, {}> {
    render() {
      return <div>FakeEditorView</div>;
    }
  }

  const setup = (props?: Partial<MainEditorViewStateProps>) => {
    const editorLoaderPromise = Promise.resolve(FakeEditorView);
    const onCloseEditor: MainEditorViewDispatchProps['onCloseEditor'] = jest.fn();
    const onShowEditorError: MainEditorViewDispatchProps['onShowEditorError'] = jest.fn();
    const onDeselectFile: MainEditorViewDispatchProps['onDeselectFile'] = jest.fn();
    const mainView = shallow(
      <MainEditorView
        editorData={{}}
        onCloseEditor={onCloseEditor}
        onShowEditorError={onShowEditorError}
        onDeselectFile={onDeselectFile}
        {...props}
      />,
    );

    return {
      mainView,
      editorLoaderPromise,
      onCloseEditor,
    };
  };

  it('should show spinner if no imageUrl, no error', () => {
    const { mainView } = setup();
    expect(mainView.find(SpinnerView)).toHaveLength(1);
    expect(mainView.find(ErrorView)).toHaveLength(0);
  });

  it('should show error if no imageUrl, but error defined', () => {
    const props = { editorData: { error: { message: 'some-message' } } };
    const { mainView } = setup(props);

    expect(mainView.find(SpinnerView)).toHaveLength(0);
    expect(mainView.find('InjectIntl(ErrorView)')).toHaveLength(1);
  });

  it('should EditorView when all is fine', () => {
    const { mainView } = setup({
      editorData: {
        imageUrl: 'some-image-url',
        originalFile: {
          id: 'some-file-id',
          name: 'some-file-name',
        },
      },
    });
    expect(mainView.find(EditorView)).toHaveLength(1);
    expectToEqual(mainView.find(EditorView).props().imageUrl, 'some-image-url');
  });
  it('should upload an image and call onCloseEditor when editor viewer calls onSave', () => {
    const { mainView, onCloseEditor } = setup({
      editorData: {
        imageUrl: 'some-image-url',
        originalFile: {
          id: 'some-file-id',
          name: 'some-file-name',
        },
      },
    });
    mainView
      .find(EditorView)
      .props()
      .onSave('some-image-string', { width: 200, height: 100 });
    // expectFunctionToHaveBeenCalledWith(binaryUploader.upload, [
    //   'some-image-string',
    //   'some-file-name',
    // ]);
    expectFunctionToHaveBeenCalledWith(onCloseEditor, ['Save']);
  });

  it('should call onCloseEditor when editor viewer calls onCancel', () => {
    const { mainView, onCloseEditor } = setup({
      editorData: {
        imageUrl: 'some-image-url',
        originalFile: {
          id: 'some-file-id',
          name: 'some-file-name',
        },
      },
    });
    mainView
      .find(EditorView)
      .props()
      .onCancel();
    expectFunctionToHaveBeenCalledWith(onCloseEditor, ['Close']);
  });
});
