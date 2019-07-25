import { TextSelection } from 'prosemirror-state';
import { INLINE_COMMENT } from '@atlaskit/adf-schema';

import {
  annotationQuery,
  createEditorFactory,
  doc,
  p,
} from '@atlaskit/editor-test-helpers';

import * as annotationCommands from '../../../../plugins/annotation/commands';

const { setAnnotationQueryMarkAtCurrentPos } = annotationCommands;

describe('annotation', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        UNSAFE_annotationProvider: {},
      },
    });

  describe('insert', () => {
    it('creates annotationQuery marks', () => {
      const { editorView } = editor(doc(p('hello{<>}')));

      // select word hello
      editorView.dispatch(
        editorView.state.tr.setSelection(
          TextSelection.between(
            editorView.state.tr.doc.resolve(1),
            editorView.state.tr.doc.resolve(6),
          ),
        ),
      );

      const { dispatch, state } = editorView;
      setAnnotationQueryMarkAtCurrentPos(INLINE_COMMENT)(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(annotationQuery('hello'))),
      );
    });
  });
});
