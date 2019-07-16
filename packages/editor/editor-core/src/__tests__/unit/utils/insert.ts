import {
  doc,
  p,
  createEditorFactory,
  hr,
  panel,
  layoutColumn,
  layoutSection,
  ul,
  li,
  code_block,
} from '@atlaskit/editor-test-helpers';
import { safeInsert } from '../../../utils/insert';
import { NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

const safeInsertNode = (node: NodeType, editorView: EditorView) => {
  const { state, dispatch } = editorView;
  const tr = safeInsert(node.createChecked(), state.selection.from)(state.tr);
  if (tr) {
    dispatch(tr);
  }
};

describe('@atlaskit/editor-core/utils insert', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        allowRule: true,
        allowLayouts: true,
        allowLists: true,
        allowCodeBlocks: true,
      },
    });
  };

  describe('block', () => {
    describe('leaf nodes:', () => {
      describe('horizontal rule', () => {
        it('isolated', () => {
          const { editorView } = editor(doc(p('{<>}')));
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(doc(hr()));
          expect(editorView.state.selection.from).toEqual(1);
        });

        it('inline before text', () => {
          const { editorView } = editor(doc(p('{<>}onetwo')));
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(doc(hr(), p('onetwo')));
        });

        it('inline with text', () => {
          const { editorView } = editor(doc(p('one{<>}two')));
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('one'), hr(), p('two')),
          );
        });

        it('inline after text', () => {
          const { editorView } = editor(doc(p('onetwo{<>}')));
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(doc(p('onetwo'), hr()));
        });

        it('within valid parent (layout)', () => {
          const { editorView } = editor(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(p('one{<>}two')),
                layoutColumn({ width: 50 })(p('three')),
              ),
            ),
          );

          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(p('one'), hr(), p('two')),
                layoutColumn({ width: 50 })(p('three')),
              ),
            ),
          );
        });

        it('within invalid parent (panel)', () => {
          const { editorView } = editor(doc(panel()(p('one{<>}two'))));
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(panel()(p('one')), hr(), panel()(p('two'))),
          );
        });

        it('within list', () => {
          const { editorView } = editor(
            doc(ul(li(p('one')), li(p('two{<>}three')), li(p('four')))),
          );
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              ul(li(p('one')), li(p('two'))),
              hr(),
              ul(li(p('three'), li(p('four')))),
            ),
          );
        });

        it('within nested parents (layout > panel > list > codeblock)', () => {
          const { editorView } = editor(
            doc(panel()(ul(li(code_block()('one{<>}two'))))),
          );
          safeInsertNode(editorView.state.schema.nodes.rule, editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              panel()(ul(li(code_block()('one')))),
              hr(),
              panel()(ul(li(code_block()('two')))),
            ),
          );
        });
      });
    });
  });
});
