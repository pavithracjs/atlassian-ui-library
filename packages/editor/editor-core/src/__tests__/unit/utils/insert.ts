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
  table,
  tr,
  td,
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
        allowTables: true,
      },
    });
  };

  describe('block', () => {
    describe('leaf nodes:', () => {
      describe('horizontal rule', () => {
        describe('without selection and', () => {
          it('empty paragraph', () => {
            const { editorView } = editor(doc(p('{<>}')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(hr(), '{<|gap>}'),
            );
          });

          it('before text', () => {
            const { editorView } = editor(doc(p('{<>}onetwo')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(hr(), '{<|gap>}', p('onetwo')),
            );
          });

          it('within text', () => {
            const { editorView } = editor(doc(p('one{<>}two')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(p('one'), hr(), '{<|gap>}', p('two')),
            );
          });

          it('after text', () => {
            const { editorView } = editor(doc(p('onetwo{<>}')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(p('onetwo'), hr(), '{<|gap>}'),
            );
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
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                layoutSection(
                  layoutColumn({ width: 50 })(
                    p('one'),
                    hr(),
                    '{<|gap>}',
                    p('two'),
                  ),
                  layoutColumn({ width: 50 })(p('three')),
                ),
              ),
            );
          });

          it('within invalid parent (panel)', () => {
            const { editorView } = editor(doc(panel()(p('one{<>}two'))));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(panel()(p('one')), hr(), '{<|gap>}', panel()(p('two'))),
            );
          });

          it('within list item', () => {
            const { editorView } = editor(
              doc(ul(li(p('one')), li(p('two{<>}three')), li(p('four')))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                ul(li(p('one')), li(p('two'))),
                hr(),
                '{<|gap>}',
                ul(li(p('three'), li(p('four')))),
              ),
            );
          });

          it('between list items', () => {
            const { editorView } = editor(
              doc(ul(li(p('one')), li(p('two{<>}')), li(p('three')))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                ul(li(p('one')), li(p('two'))),
                hr(),
                '{<|gap>}',
                ul(li(p('three'))),
              ),
            );
          });

          it('within nested parents (layout > panel > list > codeblock)', () => {
            const { editorView } = editor(
              doc(panel()(ul(li(code_block()('one{<>}two'))))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                panel()(ul(li(code_block()('one')))),
                hr(),
                '{<|gap>}',
                panel()(ul(li(code_block()('two')))),
              ),
            );
          });
        });

        describe.only('with selection of', () => {
          it('full text', () => {
            const { editorView } = editor(doc(p('{<}onetwothree{>}')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(hr(), '{<|gap>}'),
            );
          });

          it('partial text', () => {
            const { editorView } = editor(doc(p('one{<}two{>}three')));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(p('one'), hr(), '{<|gap>}', p('three')),
            );
          });

          it('mixed nodes', () => {
            const { editorView } = editor(
              doc(p('one{<}two'), panel()('three{>}four')),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(p('one'), hr(), '{<|gap>}', panel()('four')),
            );
          });

          it('list items', () => {
            const { editorView } = editor(
              doc(ul(li(p('one{<}two')), li(p('three{>}four')))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(ul(li(p('one'))), hr(), '{<|gap>}', ul(li(p('four')))),
            );
          });

          it('table cells', () => {
            const { editorView } = editor(
              doc(
                table()(
                  tr(td({})(p('{<cell}a1')), td({})(p('a2'))),
                  tr(td({})(p('b1{cell>}')), td({})(p('b2'))),
                ),
              ),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                table()(
                  tr(td({})(hr(), '{<|gap>}'), td({})(p('a2'))),
                  tr(td({})(p('b1')), td({})(p('b2'))),
                ),
              ),
            );
          });
        });
      });
    });
  });
});
