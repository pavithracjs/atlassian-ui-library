import { createEditorFactory, p, doc } from '@atlaskit/editor-test-helpers';

import { clearEditorContent } from '../../../commands';

describe('commands', () => {
  const createEditor = (doc: any) =>
    createEditorFactory()({
      doc,
    });

  describe('clearEditorContent', () => {
    it('clears editor content', () => {
      const { editorView } = createEditor(doc(p('text{<>}')));
      clearEditorContent(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });
  });
});
