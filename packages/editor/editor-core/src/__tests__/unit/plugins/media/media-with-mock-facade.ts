const removeOnCloseListener = jest.fn();
const spies = {} as any;

const mockMediaPickerFacade = jest.fn(pickerType => {
  const picker: any = {
    on: jest.fn(),
    onClose: jest.fn().mockReturnValue(removeOnCloseListener),
    onNewMedia: jest.fn(),
    onMediaEvent: jest.fn(),
    onDrag: jest.fn(),
    hide: jest.fn(),
    setUploadParams: jest.fn(),
    show: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
    destroy: jest.fn(),
    type: 'popup',
  };
  picker.init = jest.fn().mockReturnValue(picker);
  spies[pickerType] = picker;
  return picker;
});
jest.mock(
  '../../../../plugins/media/picker-facade',
  () => mockMediaPickerFacade,
);

import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  randomId,
  createEditorFactory,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import {
  stateKey as mediaPluginKey,
  MediaPluginState,
} from '../../../../plugins/media/pm-plugins/main';
import mediaPlugin from '../../../../plugins/media';
import { waitForAllPickersInitialised } from './_utils';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    includeUserAuthProvider: true,
  });

describe('Media with mock facade', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) =>
    createEditor({
      doc,
      editorPlugins: [
        mediaPlugin({
          provider: mediaProvider,
          allowMediaSingle: true,
          customDropzoneContainer: dropzoneContainer,
        }),
      ],
      editorProps: editorProps,
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  it('should add an onClose event listener in popupPicker', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    expect(spies.popup.onClose).toHaveBeenCalledTimes(1);
    expect(spies.popup.onClose).toHaveBeenCalledWith(
      pluginState.onPopupPickerClose,
    );
    pluginState.destroy();
  });

  it('should cleanup properly on destroy', async () => {
    removeOnCloseListener.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    pluginState.destroy();
    expect(removeOnCloseListener).toHaveBeenCalledTimes(1);
  });
});
