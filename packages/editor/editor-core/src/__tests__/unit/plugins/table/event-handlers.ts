import { TextSelection } from 'prosemirror-state';
import {
  doc,
  createEditorFactory,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import { pluginKey } from '../../../../plugins/table/pm-plugins/main';
import { TablePluginState } from '../../../../plugins/table/types';
import { handleMouseOver } from '../../../../plugins/table/event-handlers';
import { showInsertColumnButton } from '../../../../plugins/table/commands';

describe('table event handlers', () => {
  let editor: any;

  beforeEach(() => {
    const createEditor = createEditorFactory<TablePluginState>();
    editor = (doc: any) =>
      createEditor({
        doc,
        editorProps: { allowTables: true },
        pluginKey,
      });
  });

  describe('#handleMouseOver', () => {
    describe('when insert col/row button is hidden', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const { state } = editorView;
        const cursorPos = 8;
        editorView.dispatch(
          state.tr.setSelection(
            new TextSelection(state.doc.resolve(cursorPos)),
          ),
        );
        const event = {
          target: editorView.dom.querySelector('td'),
        };
        expect(handleMouseOver(editorView, event as MouseEvent)).toEqual(false);
      });
    });

    describe('when insert col/row button is visible', () => {
      it('should call hideInsertColumnOrRowButton when moving to the first cell', () => {
        const { editorView, refs } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );

        showInsertColumnButton(0)(editorView.state, editorView.dispatch);

        const firstCell = editorView.domAtPos(refs['<>']);
        const event = {
          target: firstCell.node,
        };
        expect(handleMouseOver(editorView, event as MouseEvent)).toEqual(true);
      });
    });
  });
});
