import { NodeSelection } from 'prosemirror-state';
import {
  createEditorFactory,
  doc,
  p,
  insertText,
  hr,
} from '@atlaskit/editor-test-helpers';
import { GapCursorSide } from '../../..';
import { setGapCursorSelection } from '../../../utils';

describe('toEqualDocument ref comparison', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowRule: true,
      },
    });

  it('matching cursor position', () => {
    const { editorView } = editor(doc(p('Hello{<>}World')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<>}World')),
    );
  });

  it('moved cursor position', () => {
    const { editorView } = editor(doc(p('Hello{<>}')));
    insertText(editorView, 'World');
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld{<>}')),
    );
  });

  it('matching text selection', () => {
    const { editorView } = editor(doc(p('Hello{<}World{>}')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<}World{>}')),
    );
  });

  it('matches node selections', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld{<>}'), '{nextPos}', hr()),
    );
    const { state, dispatch } = editorView;
    dispatch(
      state.tr.setSelection(NodeSelection.create(state.doc, refs.nextPos)),
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), '{<node>}', hr()),
    );
  });

  it('matches gap cursor selection', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld'), hr(), '{nextPos}'),
    );
    setGapCursorSelection(editorView, refs.nextPos, GapCursorSide.RIGHT);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), hr(), '{|gap}'),
    );
  });
});
