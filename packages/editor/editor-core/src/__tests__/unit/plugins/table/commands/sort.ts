import {
  createEditorFactory,
  doc,
  p,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers';
import { sortByColumn } from '../../../../../plugins/table/commands/sort';
import { SortOrder } from '../../../../../plugins/table/types';

describe('Sort Table', () => {
  const createEditor = createEditorFactory();
  it('should test a basic table with heading', () => {
    const { editorView } = createEditor({
      editorProps: {
        allowTables: {
          advanced: true,
        },
      },
      doc: doc(
        table()(
          tr(th({})(p('Number{<>}'))),
          tr(td({})(p('10{<>}'))),
          tr(td({})(p('0'))),
          tr(td({})(p('5'))),
        ),
      ),
    });
    sortByColumn(0)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        table()(
          tr(th({})(p('Number'))),
          tr(td({})(p('10'))),
          tr(td({})(p('5'))),
          tr(td({})(p('0'))),
        ),
      ),
    );
  });

  it('should test a basic table descending', () => {
    const { editorView } = createEditor({
      editorProps: {
        allowTables: {
          advanced: true,
          allowHeaderRow: false,
        },
      },
      doc: doc(
        table()(tr(td({})(p('2{<>}'))), tr(td({})(p('5'))), tr(td({})(p('4')))),
      ),
    });
    sortByColumn(0)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(table()(tr(td({})(p('5'))), tr(td({})(p('4'))), tr(td({})(p('2'))))),
    );
  });

  it('should test a basic table ascending', () => {
    const { editorView } = createEditor({
      editorProps: {
        allowTables: {
          allowHeaderRow: false,
        },
      },
      doc: doc(
        table()(tr(td({})(p('2{<>}'))), tr(td({})(p('5'))), tr(td({})(p('4')))),
      ),
    });
    sortByColumn(0, SortOrder.ASC)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(table()(tr(td({})(p('2'))), tr(td({})(p('4'))), tr(td({})(p('5'))))),
    );
  });
});
