import { ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditorFactory,
  doc,
  mediaSingle,
  mediaGroup,
  media,
} from '@atlaskit/editor-test-helpers';
import mediaPlugin from '../../../../../plugins/media';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/main';
import { stateKey as mediaPluginKey } from '../../../../../plugins/media/pm-plugins/main';
import { getFreshMediaProvider, testCollectionName } from '../_utils';
import {
  updateMediaNodeAttrs,
  removeMediaNodeInPos,
} from '../../../../../plugins/media/commands';

describe('Media plugin commands', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const mediaPluginOptions = (dropzoneContainer: HTMLElement) => ({
    provider: mediaProvider,
    allowMediaSingle: true,
    customDropzoneContainer: dropzoneContainer,
  });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
    extraPlugins: any[] = [],
  ) => {
    return createEditor({
      doc,
      editorPlugins: [
        mediaPlugin(mediaPluginOptions(dropzoneContainer)),
        ...extraPlugins,
      ],
      editorProps: {
        ...editorProps,
        allowAnalyticsGASV3: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });
  };

  describe('Update Media Node Attributes', async () => {
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

  describe('Remove Media Node in Pos', () => {
    it('removes media node', async () => {
      const deletingMediaNodeId = 'foo';
      const deletingMediaNode = media({
        id: deletingMediaNodeId,
        type: 'file',
        __fileMimeType: 'pdf',
        collection: testCollectionName,
      })();
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(deletingMediaNode),
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
      const mediaToBeDeletedPosition = 1;

      removeMediaNodeInPos(() => mediaToBeDeletedPosition)(
        editorView.state,
        editorView.dispatch,
        editorView,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      pluginState.destroy();
    });
  });
});
