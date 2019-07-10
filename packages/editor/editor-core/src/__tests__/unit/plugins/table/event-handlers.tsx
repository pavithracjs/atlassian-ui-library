jest.mock('../../../../plugins/table/commands/misc', () => ({
  hideInsertColumnOrRowButton: jest.fn(() => jest.fn()),
  goToNextCell: jest.fn(),
  triggerUnlessTableHeader: jest.fn(),
}));

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
import { hideInsertColumnOrRowButton } from '../../../../plugins/table/commands/misc';

describe('table action handlers', () => {
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
    it('will call hideInsertColumnOrRowButton when moving to the first cell', () => {
      const { editorView, refs } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const firstCell = editorView.domAtPos(refs['<>']);
      const mouseOverEvent = {
        target: firstCell.node,
      } as MouseEvent;

      handleMouseOver(editorView, mouseOverEvent);
      expect(hideInsertColumnOrRowButton).toHaveBeenCalled();
    });
  });
});
