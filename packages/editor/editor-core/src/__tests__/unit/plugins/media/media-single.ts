import {
  doc,
  p,
  mediaSingle,
  media,
  extension,
  createEditorFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';

import {
  insertMediaSingleNode,
  insertMediaAsMediaSingle,
} from '../../../../plugins/media/utils/media-single';
import { MediaState } from '../../../../plugins/media/pm-plugins/main';
import {
  temporaryFileId,
  testCollectionName,
  temporaryMediaWithDimensions,
  temporaryMedia,
} from './_utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import { INPUT_METHOD } from '../../../../plugins/analytics';

const createMediaState = (
  id: string,
  width = 256,
  height = 128,
): MediaState => ({
  id,
  status: 'preview',
  dimensions: { width, height },
});

describe('media-single', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
    });
    return createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        media: {
          allowMediaSingle: true,
        },
        contextIdentifierProvider,
      },
      providerFactory,
    });
  };

  describe('insertMediaAsMediaSingle', () => {
    describe('when inserting node that is not a media node', () => {
      it('does not insert mediaSingle', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        insertMediaAsMediaSingle(
          editorView,
          p('world')(editorView.state.schema),
          INPUT_METHOD.PICKER_CLOUD,
        );

        expect(editorView.state.doc).toEqualDocument(doc(p('text')));
      });
    });

    describe('when inserting node is a media node', () => {
      describe('when media node is not an image', () => {
        it('does not insert mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'pdf',
            })()(editorView.state.schema),
            INPUT_METHOD.PICKER_CLOUD,
          );

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });

      describe('when media node is an image', () => {
        it('inserts mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
            INPUT_METHOD.PICKER_CLOUD,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  __fileMimeType: 'image/png',
                })(),
              ),
              p(),
            ),
          );
        });
      });
    });
  });

  describe('insertMediaSingleNode', () => {
    describe('when there is only one image data', () => {
      it('inserts one mediaSingle node into the document', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertMediaSingleNode(
          editorView,
          createMediaState(temporaryFileId),
          INPUT_METHOD.PICKER_CLOUD,
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
            p(),
          ),
        );
      });
    });

    describe("when there are multiple images' data", () => {
      it('inserts multiple mediaSingle nodes into the document', () => {
        const { editorView } = editor(doc(p('text{<>}hello')));

        ([
          createMediaState(temporaryFileId),
          createMediaState(temporaryFileId + '1'),
          createMediaState(temporaryFileId + '2'),
        ] as Array<MediaState>).forEach(state =>
          insertMediaSingleNode(
            editorView,
            state,
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          ),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '1',
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '2',
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            p('hello'),
          ),
        );
      });
    });

    describe('when current selection not empty', () => {
      describe('at the beginning of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('{<}text{>}')));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(),
            ),
          );
        });
      });

      describe('at the middle of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('hello'), p('{<}text{>}'), p()));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(''),
            ),
          );
        });
      });

      describe('at the end of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(
            doc(p('hello'), p('world'), p('{<}text{>}')),
          );

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              p('world'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(''),
            ),
          );
        });
      });

      describe('is NodeSelection', () => {
        it('replaces the selected node', () => {
          const { editorView } = editor(
            doc(
              p('hello'),
              '{<node>}',
              extension({ extensionKey: 'extKey', extensionType: 'extType' })(),
            ),
          );

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(),
            ),
          );
        });
      });
    });

    it('should respect scaleFactor', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        { ...createMediaState(temporaryFileId), scaleFactor: 2 },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            temporaryMediaWithDimensions(128, 64),
          ),
          p(),
        ),
      );
    });

    it('should create a media node with integer dimensions after scaleFactor', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        { ...createMediaState(temporaryFileId), scaleFactor: 2.2 },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            temporaryMediaWithDimensions(116, 58),
          ),
          p(),
        ),
      );
    });

    it('should not set dimensions on media node if none defined', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        {
          id: temporaryFileId,
          status: 'preview',
        },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p(),
        ),
      );
    });
  });

  it('should be able to show mediaSingle without height or width', () => {
    const { editorView } = editor(
      doc(p('text'), mediaSingle()(temporaryMedia), p()),
    );

    const mediaSingleDom = editorView.dom.querySelector('.media-single');
    expect(mediaSingleDom).toBeInstanceOf(HTMLElement);
    expect(mediaSingleDom!.getAttribute('width')).toBe('250');
    expect(mediaSingleDom!.getAttribute('height')).toBe('200');
  });
});
