import { ProviderFactory } from '@atlaskit/editor-common';

import {
  insertMediaSingleNode,
  mediaPlugin,
  mediaPluginKey,
  MediaOptions,
  MediaState,
  MediaProvider,
} from '@atlaskit/editor-core';

import {
  doc,
  p,
  mediaSingle,
  media,
  createEditorFactory,
  randomId,
  sleep,
} from '@atlaskit/editor-test-helpers';

import { Auth, AuthProvider } from '@atlaskit/media-core';
import uuid from 'uuid/v4';

let testFileId: string;

let testMediaAuth: Auth;

const createMediaState = (
  collection: string,
  width = 256,
  height = 128,
): MediaState => ({
  id: testFileId,
  collection,
  status: 'ready',
  dimensions: { width, height },
});

const createMedia = (collection: string, width = 256, height = 128) =>
  media({
    type: 'file',
    id: testFileId,
    collection,
    width,
    height,
  })();

describe('Mobile MediaProvider', async () => {
  const createEditor = createEditorFactory();

  let mockMediaProvider: Promise<MediaProvider>;
  let mockAuthProvider: AuthProvider;
  let providerFactory: ProviderFactory;

  beforeEach(() => {
    testFileId = uuid();
    testMediaAuth = {
      clientId: `media-plugin-mock-clientId-${randomId()}`,
      token: 'some-token',
      baseUrl: '/',
    };

    mockAuthProvider = jest.fn<AuthProvider>(() => async () => testMediaAuth);

    const mockMediaClientConfig = Promise.resolve({
      authProvider: mockAuthProvider,
    });

    mockMediaProvider = Promise.resolve({
      viewMediaClientConfig: mockMediaClientConfig,
      uploadMediaClientConfig: mockMediaClientConfig,
      uploadParams: {
        collection: '',
      },
    });

    providerFactory = ProviderFactory.create({
      mediaProvider: mockMediaProvider,
    });
  });

  const editor = (doc: any, mediaOptions: MediaOptions) =>
    createEditor({
      doc,
      editorProps: {
        appearance: 'mobile',
      },
      editorPlugins: [mediaPlugin(mediaOptions)],
      pluginKey: mediaPluginKey,
      providerFactory,
    });

  afterAll(() => {
    providerFactory.destroy();
  });

  describe('rendering mediaSingle', () => {
    describe('having collection name', () => {
      it("should call media's AuthProvider", async () => {
        const { editorView } = editor(doc(p('text{<>}')), {
          allowMediaSingle: true,
          provider: mockMediaProvider,
        });

        const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

        const provider = await mockMediaProvider;
        await provider.viewMediaClientConfig;

        insertMediaSingleNode(
          editorView,
          createMediaState(testCollectionName, 128, 256),
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              createMedia(testCollectionName, 128, 256),
            ),
            p(),
          ),
        );

        // flushes promise resolution queue so that the async media API calls mockAuthProvider
        await sleep(0);

        expect(mockAuthProvider).toHaveBeenCalledWith({
          collectionName: testCollectionName,
        });
      });
    });

    describe('having empty collection name', () => {
      it("should call media's AuthProvider", async () => {
        const { editorView } = editor(doc(p('text{<>}')), {
          allowMediaSingle: true,
          provider: mockMediaProvider,
        });

        const emptyCollectionName = '';

        const provider = await mockMediaProvider;
        await provider.viewMediaClientConfig;

        insertMediaSingleNode(
          editorView,
          createMediaState(emptyCollectionName, 128, 256),
          emptyCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              createMedia(emptyCollectionName, 128, 256),
            ),
            p(),
          ),
        );

        // flushes promise resolution queue so that the async media API calls mockAuthProvider
        await sleep(0);

        // Due to logic in packages/media/media-client/src/client/file-fetcher.ts:122-143 empty collection name
        // is batched together with all the other "falsy" values and later transformed into undefined.
        expect(mockAuthProvider).toHaveBeenCalledWith({
          collectionName: undefined,
        });
      });
    });
  });
});
