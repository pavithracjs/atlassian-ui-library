import { ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditorFactory,
  doc,
  mediaSingle,
  media,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/main';
import { stateKey as mediaPluginKey } from '../../../../../plugins/media/pm-plugins/main';
import { getFreshMediaProvider, testCollectionName } from '../_utils';
import { updateMediaNodeAttrs } from '../../../../../plugins/media/commands';

describe('Media plugin commands', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const contextIdentifierProvider = storyContextIdentifierProviderFactory();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({
    mediaProvider,
    contextIdentifierProvider,
  });

  const mediaPluginOptions = (dropzoneContainer: HTMLElement) => ({
    provider: mediaProvider,
    allowMediaSingle: true,
    customDropzoneContainer: dropzoneContainer,
  });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) => {
    return createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: mediaPluginOptions(dropzoneContainer),
        contextIdentifierProvider,
        allowAnalyticsGASV3: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });
  };

  describe('Update Media Node Attributes', () => {
    it('should update media attributes for media single', () => {
      const { editorView } = editor(
        doc(
          mediaSingle({
            layout: 'center',
          })(
            media({
              id: '1',
              type: 'file',
              collection: testCollectionName,
              __fileName: 'foo.jpg',
              __fileSize: 100,
              __fileMimeType: 'image/jpeg',
              height: 100,
              width: 100,
            })(),
          ),
        ),
      );

      updateMediaNodeAttrs(
        '1',
        {
          height: 200,
          width: 200,
        },
        true,
      )(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaSingle({
            layout: 'center',
          })(
            media({
              id: '1',
              type: 'file',
              collection: testCollectionName,
              __fileName: 'foo.jpg',
              __fileSize: 100,
              __fileMimeType: 'image/jpeg',
              height: 200,
              width: 200,
            })(),
          ),
        ),
      );
    });
  });
});
