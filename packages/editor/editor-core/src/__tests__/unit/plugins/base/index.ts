import {
  compareSelection,
  createEditorFactory,
  doc,
  p,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';

describe('Delete', () => {
  const createEditor = createEditorFactory();
  const editorFactory = (doc: any) =>
    createEditor({
      doc,
    });

  it(`should merge paragraph and preserve content`, () => {
    const { editorView } = editorFactory(doc(p('Hello{<>}'), p('World')));

    sendKeyToPm(editorView, 'Delete');

    const expectedDoc = doc(p('Hello{<>}World'));
    expect(editorView.state.doc).toEqualDocument(expectedDoc);
    compareSelection(editorFactory, expectedDoc, editorView);
  });
});
