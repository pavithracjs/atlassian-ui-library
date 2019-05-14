import { ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditorFactory,
  doc,
  p,
  media,
  randomId,
} from '@atlaskit/editor-test-helpers';
import mediaPlugin from '../../../../../plugins/media';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/main';
import { stateKey as mediaPluginKey } from '../../../../../plugins/media/pm-plugins/main';
import { getFreshMediaProvider } from '../_utils';

import { Node } from 'prosemirror-model';
import { setMediaGroupItems } from '../../../../../plugins/media/commands/actions';

export const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

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

  describe('Set media group items', () => {
    it('should set media group items via command', () => {
      const { editorView, pluginState } = editor(doc(p('')));
      const mediaNode = media({
        id: '2',
        type: 'file',
        collection: testCollectionName,
        __fileName: 'bar.png',
        __fileSize: 200,
        __fileMimeType: 'image/png',
        height: 200,
        width: 200,
      })()(editorView.state.schema) as Node;

      setMediaGroupItems([
        {
          id: '2',
          node: mediaNode,
          getPos: () => 1,
        },
      ])(editorView.state, editorView.dispatch, editorView);

      expect(pluginState.mediaGroupNodes['2']).toEqual(
        expect.objectContaining({
          node: mediaNode,
        }),
      );
    });
  });
});
