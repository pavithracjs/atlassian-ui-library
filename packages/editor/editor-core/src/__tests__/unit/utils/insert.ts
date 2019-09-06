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

  describe('leaf', () => {
    describe('block', () => {
      describe('horizontal rule', () => {
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

        it.skip('within text', () => {
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

        it.skip('within valid parent (layout)', () => {
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

        describe('within invalid parent', () => {
          it('start of first line', () => {
            const { editorView } = editor(
              doc(panel()(p('{<>}onetwo'), p('three'))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
            );
          });

          it.skip('middle of line', () => {
            const { editorView } = editor(
              doc(panel()(p('one{<>}two'), p('three'))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                panel()(p('one')),
                hr(),
                '{<|gap>}',
                panel()(p('two'), p('three')),
              ),
            );
          });

          it('end of first line', () => {
            const { editorView } = editor(
              doc(panel()(p('onetwo{<>}'), p('three'))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(panel()(p('onetwo')), hr(), '{<|gap>}', panel()(p('three'))),
            );
          });

          it('start of last line', () => {
            const { editorView } = editor(
              doc(panel()(p('onetwo'), p('{<>}three'))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(panel()(p('onetwo')), hr(), '{<|gap>}', panel()(p('three'))),
            );
          });

          it('end of last line', () => {
            const { editorView } = editor(
              doc(panel()(p('onetwo'), p('three{<>}'))),
            );
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(panel()(p('onetwo'), p('three')), hr(), '{<|gap>}'),
            );
          });

          it('empty paragraph', () => {
            const { editorView } = editor(doc(panel()(p('{<>}'))));
            safeInsertNode(editorView.state.schema.nodes.rule, editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(panel()(p('')), hr(), '{<|gap>}'),
            );
          });
        });

        it.skip('within nested parents', () => {
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

        describe('list', () => {
          describe('single', () => {
            it('start of single line', () => {
              const { editorView } = editor(doc(ul(li(p('{<>}onetwo')))));
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(hr(), '{<|gap>}', ul(li(p('onetwo')))),
              );
            });

            it.skip('middle of single line', () => {
              const { editorView } = editor(doc(ul(li(p('one{<>}two')))));
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(ul(li(p('one'))), hr(), '{<|gap>}', ul(li(p('two')))),
              );
            });

            it('end of single line', () => {
              const { editorView } = editor(doc(ul(li(p('onetwo{<>}')))));
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(ul(li(p('onetwo'))), hr(), '{<|gap>}'),
              );
            });
          });

          describe('simple', () => {
            it('start of first line', () => {
              const { editorView } = editor(
                doc(ul(li(p('{<>}one')), li(p('two')), li(p('three')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  hr(),
                  '{<|gap>}',
                  ul(li(p('one')), li(p('two')), li(p('three'))),
                ),
              );
            });

            it.skip('middle of first line', () => {
              const { editorView } = editor(
                doc(ul(li(p('on{<>}e')), li(p('two')), li(p('three')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('on'))),
                  hr(),
                  '{<|gap>}',
                  ul(li(p('e')), li(p('two')), li(p('three'))),
                ),
              );
            });

            it('end of first line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one{<>}')), li(p('two')), li(p('three')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('one'))),
                  hr(),
                  '{<|gap>}',
                  ul(li(p('two')), li(p('three'))),
                ),
              );
            });

            it('start of middle line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one')), li(p('{<>}two')), li(p('three')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('one'))),
                  hr(),
                  '{<|gap>}',
                  ul(li(p('two')), li(p('three'))),
                ),
              );
            });

            it.skip('middle of middle line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one')), li(p('tw{<>}o')), li(p('three')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('one')), li(p('tw'))),
                  hr(),
                  '{<|gap>}',
                  ul(li(p('o')), li(p('three'))),
                ),
              );
            });

            it('end of middle line', () => {
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

            it('start of last line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one')), li(p('two')), li(p('{<>}three')))),
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

            it.skip('middle of end line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one')), li(p('two')), li(p('thr{<>}ee')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('one')), li(p('two')), li(p('thr'))),
                  hr(),
                  '{<|gap>}',
                  ul(li(p('ee'))),
                ),
              );
            });

            it('end of end line', () => {
              const { editorView } = editor(
                doc(ul(li(p('one')), li(p('two')), li(p('three{<>}')))),
              );
              safeInsertNode(editorView.state.schema.nodes.rule, editorView);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  ul(li(p('one')), li(p('two')), li(p('three'))),
                  hr(),
                  '{<|gap>}',
                ),
              );
            });
          });
        });
      });
    });
  });
});
