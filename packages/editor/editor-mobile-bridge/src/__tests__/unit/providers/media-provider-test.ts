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

import { Auth, AuthProvider, ProcessedFileState } from '@atlaskit/media-core';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import uuid from 'uuid/v4';

const testFileId = uuid();

const testMediaAuth: Auth = {
  clientId: `media-plugin-mock-clientId-${randomId()}`,
  token:
    // doesn't matter what's inside the JWT, just to show a valid one here
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
  baseUrl: '/',
};

const testFileState: ProcessedFileState = {
  status: 'processed',
  id: testFileId,
  name: 'image.jpeg',
  size: 100,
  artifacts: {},
  mediaType: 'image',
  mimeType: 'image/jpeg',
  representations: {
    image: {},
  },
};

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

  const mockAuthProvider = jest.fn<AuthProvider>(() => async () =>
    testMediaAuth,
  );

  const mockMediaProvider = (async () => {
    const mockMediaContext = Promise.resolve(
      fakeMediaClient({
        authProvider: mockAuthProvider,
        mockFileStates: [testFileState],
      }),
    );

    return {
      viewContext: mockMediaContext,
      uploadContext: mockMediaContext,
      uploadParams: {
        collection: '',
      },
    } as MediaProvider;
  })();

  const providerFactory = ProviderFactory.create({
    mediaProvider: mockMediaProvider,
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

  beforeEach(() => {
    mockAuthProvider.mockClear();
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
        await provider.viewContext;

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
        await provider.viewContext;

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

        expect(mockAuthProvider).toHaveBeenCalledWith({
          collectionName: emptyCollectionName,
        });
      });
    });
  });
});
