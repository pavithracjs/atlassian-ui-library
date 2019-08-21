import {
  createEditorFactory,
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers';
import { getCellsInRow } from 'prosemirror-utils';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  getPluginState,
  pluginKey,
} from '../../../../../plugins/table/pm-plugins/main';
import {
  TableCssClassName,
  TableDecorations,
  TablePluginState,
} from '../../../../../plugins/table/types';
import { EditorProps } from '../../../../../types';

interface DecorationWidget extends Decoration {
  type: {
    toDOM: HTMLElement;
  };
}

const basicTable = table()(
  tr(tdCursor, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
);

describe('table decorations', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any, props: Partial<EditorProps> = {}) =>
    createEditor({
      doc,
      editorProps: { allowTables: true, ...props },
      pluginKey,
    });

  const getTableDecorations = (
    editorView: EditorView,
    cells: Array<{ pos: number }>,
    key?: TableDecorations,
  ) => {
    const { decorationSet }: { decorationSet: DecorationSet } = getPluginState(
      editorView.state,
    );

    if (key) {
      return decorationSet.find(
        cells[0].pos,
        cells[cells.length - 1].pos,
        spec => spec.key.indexOf(key) > -1,
      );
    }

    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe.each([true, false])(
    'with allowColumnResizing=(%s)',
    allowColumnResizing => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(basicTable), {
          allowTables: { allowColumnResizing },
        }));
      });

      test(`should ${
        allowColumnResizing ? '' : 'not'
      } add resize handler`, () => {
        const cells = getCellsInRow(0)(editorView.state.selection)!;

        const decorations = getTableDecorations(
          editorView,
          cells,
          TableDecorations.COLUMN_CONTROLS_DECORATIONS,
        ) as Array<DecorationWidget>;

        for (const decor of decorations) {
          const resizeHandler = decor.type.toDOM.querySelector(
            `.${TableCssClassName.RESIZE_HANDLE}`,
          );
          if (allowColumnResizing) {
            expect(resizeHandler).not.toBeNull();
          } else {
            expect(resizeHandler).toBeNull();
          }
        }
      });
    },
  );
});
