import {
  doc,
  p,
  createEditorFactory,
  table,
  tr,
  tdEmpty,
} from '@atlaskit/editor-test-helpers';
import { selectTable } from 'prosemirror-utils';
import { TableCssClassName as ClassName } from '../../../../../plugins/table/types';
import { TablePluginState } from '../../../../../plugins/table/types';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/main';

describe('table -> nodeviews -> TableComponent.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: { advanced: true },
      },
      pluginKey,
    });

  describe('when the table is selected', () => {
    it('should adds table selected css class', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      dispatch(selectTable(state.tr));

      const tableContainer = document.querySelector(
        `.${ClassName.TABLE_CONTAINER}`,
      );
      expect(
        tableContainer!.classList.contains(ClassName.TABLE_SELECTED),
      ).toBeTruthy();
    });
  });
});
