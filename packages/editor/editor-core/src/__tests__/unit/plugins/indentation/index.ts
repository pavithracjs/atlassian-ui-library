import {
  doc,
  p,
  createEditorFactory,
  h1,
  ol,
  li,
  panel,
  blockquote,
  indentation,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { TextSelection } from 'prosemirror-state';

import * as indentationCommands from '../../../../plugins/indentation/commands';

const { indent, outdent } = indentationCommands;

describe('indentation', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowLists: true,
        allowPanel: true,
        allowIndentation: true,
        allowTextAlignment: true,
      },
    });

  describe('indent', () => {
    it('indents a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(p('hello'))),
      );
    });

    it('indents only the current paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}'), p('world')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(p('hello')), p('world')),
      );
    });

    it('indents a top level heading', () => {
      const { editorView } = editor(doc(h1('hello{<>}')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(h1('hello'))),
      );
    });

    it('indents multiple blocks', () => {
      const { editorView } = editor(
        doc(p('{<}hello'), blockquote(p('hello')), p('world{>}')),
      );
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          indentation({ level: 1 })(p('hello')),
          blockquote(p('hello')),
          indentation({ level: 1 })(p('world')),
        ),
      );
    });

    it('should not indent more than 6 levels', () => {
      const { editorView } = editor(
        doc(indentation({ level: 6 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 6 })(p('hello'))),
      );
    });

    it('should indent a list', () => {
      const { editorView } = editor(doc(ol(li(p('one{<>}')), li(p('two')))));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(ol(li(p('one{<>}')), li(p('two'))))),
      );
    });
  });

  describe('outdent', () => {
    it('outdents a top level paragraph', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(p('hello'))),
      );
    });

    it('outdents only the current paragraph', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(p('hello{<>}')), p('world')),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(p('hello')), p('world')),
      );
    });

    it('outdents a top level heading', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(h1('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(h1('hello'))),
      );
    });

    it('outdents multiple blocks', () => {
      const { editorView } = editor(
        doc(
          indentation({ level: 2 })(p('{<}hello')),
          blockquote(p('hello')),
          indentation({ level: 3 })(p('world{>}')),
        ),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          indentation({ level: 1 })(p('hello')),
          blockquote(p('hello')),
          indentation({ level: 2 })(p('world')),
        ),
      );
    });

    it('should remove the marks when is at level 1', () => {
      const { editorView } = editor(
        doc(indentation({ level: 1 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
    });

    it('should outdent a list', () => {
      const { editorView } = editor(
        doc(indentation({ level: 1 })(ol(li(p('one{<>}')), li(p('two'))))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('one{<>}')), li(p('two')))),
      );
    });
  });

  describe('keymap', () => {
    let indentMock;
    let outdentMock;

    beforeAll(() => {
      indentMock = jest.spyOn(indentationCommands, 'indent');
      outdentMock = jest.spyOn(indentationCommands, 'outdent');
    });

    beforeEach(() => {
      indentMock.mockReset();
      outdentMock.mockReset();
    });

    afterAll(() => {
      indentMock.mockRestore();
      outdentMock.mockRestore();
    });

    describe('indent on Tab', () => {
      it('should fire when inside a paragraph', () => {
        const { editorView } = editor(doc(p('{<>}')));

        expect(indentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Tab');
        expect(indentMock).toHaveBeenCalledTimes(1);
      });

      it('should fire when inside the first list item', () => {
        const { editorView } = editor(doc(ol(li(p('one{<>}')))));

        expect(indentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Tab');
        expect(indentMock).toHaveBeenCalledTimes(1);
      });

      it('should fire when selection contains the first list item', () => {
        const { editorView } = editor(doc(ol(li(p('one')), li(p('two')))));

        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 4, 12),
          ),
        );

        expect(indentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Tab');
        expect(indentMock).toHaveBeenCalledTimes(1);
      });

      it('should not fire when not inside the first list item', () => {
        const { editorView } = editor(doc(ol(li(p('one')), li(p('two{<>}')))));

        sendKeyToPm(editorView, 'Tab');
        expect(indentMock).toHaveBeenCalledTimes(0);
      });

      it('should not fire if the list is not in top level', () => {
        const { editorView } = editor(doc(panel()(ol(li(p('one{<>}'))))));

        sendKeyToPm(editorView, 'Tab');
        expect(indentMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('outdent on Shift + Tab', () => {
      it('should fire when inside a paragraph', () => {
        const { editorView } = editor(doc(p('{<>}')));

        expect(outdentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(1);
      });

      it('should fire when inside the first list item with indentation', () => {
        const { editorView } = editor(
          doc(indentation({ level: 1 })(ol(li(p('one{<>}'))))),
        );

        expect(outdentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(1);
      });

      it('should note fire when inside the first list item without indentation', () => {
        const { editorView } = editor(doc(ol(li(p('one{<>}')))));

        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(0);
      });

      it('should fire when selection contains the first list item with indentation', () => {
        const { editorView } = editor(
          doc(indentation({ level: 1 })(ol(li(p('one')), li(p('two'))))),
        );

        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 4, 12),
          ),
        );

        expect(outdentMock).toHaveBeenCalledTimes(0);
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(1);
      });

      it('should fire when selection contains the first list item without indentation', () => {
        const { editorView } = editor(doc(ol(li(p('one')), li(p('two')))));

        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 4, 12),
          ),
        );

        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(0);
      });

      it('should not fire when not inside the first list item', () => {
        const { editorView } = editor(doc(ol(li(p('one')), li(p('two{<>}')))));

        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(0);
      });

      it('should not fire if the list is not in top level', () => {
        const { editorView } = editor(doc(panel()(ol(li(p('one{<>}'))))));

        sendKeyToPm(editorView, 'Shift-Tab');
        expect(outdentMock).toHaveBeenCalledTimes(0);
      });
    });

    it('should call outdent command on Backspace at the start of node', () => {
      const { editorView } = editor(doc(p('{<>}hello')));

      expect(outdentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Backspace');
      expect(outdentMock).toHaveBeenCalledTimes(1);
    });

    it('should not call outdent command on Backspace if not at the start of node', () => {
      const { editorView } = editor(doc(p('h{<>}ello')));

      expect(outdentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Backspace');
      expect(outdentMock).toHaveBeenCalledTimes(0);
    });
  });
});
