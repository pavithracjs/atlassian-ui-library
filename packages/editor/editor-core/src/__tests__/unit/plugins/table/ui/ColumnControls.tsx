import {
  createEditorFactory,
  doc,
  mountWithIntl,
  p,
  selectColumns,
  table,
  td,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers';
import { getSelectionRect } from 'prosemirror-utils';
import * as React from 'react';
import { setTextSelection } from '../../../../../index';
import { tablesPlugin } from '../../../../../plugins';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/main';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../../../plugins/table/types';
import ColumnControls from '../../../../../plugins/table/ui/TableFloatingControls/ColumnControls';

const ControlsButton = `.${ClassName.CONTROLS_BUTTON}`;
const ColumnControlsButtonWrap = `.${ClassName.COLUMN_CONTROLS_BUTTON_WRAP}`;
const InsertColumnButton = `.${ClassName.CONTROLS_INSERT_BUTTON_WRAP}`;
const InsertColumnButtonInner = `.${ClassName.CONTROLS_INSERT_BUTTON_INNER}`;

describe('ColumnControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey,
    });

  [1, 2, 3].forEach(column => {
    describe(`when table has ${column} columns`, () => {
      it(`should render ${column} column header buttons`, () => {
        const nodes = [tdCursor];
        for (let i = 1; i < column; i++) {
          nodes.push(tdEmpty);
        }
        const { editorView } = editor(doc(p('text'), table()(tr(...nodes))));
        const floatingControls = mountWithIntl(
          <ColumnControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );

        expect(floatingControls.find(ColumnControlsButtonWrap)).toHaveLength(
          column,
        );
        floatingControls.unmount();
      });
    });
  });

  [0, 1, 2].forEach(column => {
    describe(`when HeaderButton in column ${column + 1} is clicked`, () => {
      it('should not move the cursor when hovering controls', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p('{nextPos}')), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mountWithIntl(
          <ColumnControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );

        // move to header row
        const { nextPos } = refs;
        setTextSelection(editorView, nextPos);

        // now hover the column
        floatingControls
          .find(ColumnControlsButtonWrap)
          .at(column)
          .find('button')
          .first()
          .simulate('mouseover');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        // release the hover
        floatingControls
          .find(ColumnControlsButtonWrap)
          .at(column)
          .find('button')
          .first()
          .simulate('mouseout');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        floatingControls.unmount();
      });
    });
  });

  it('applies the danger class to the column buttons', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mountWithIntl(
      <ColumnControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        isInDanger={true}
        hoveredColumns={[0, 1, 2]}
      />,
    );

    floatingControls
      .find(ColumnControlsButtonWrap)
      .slice(0, 2)
      .forEach(buttonWrap => {
        expect(buttonWrap.hasClass('danger')).toBe(true);
      });

    floatingControls.unmount();
  });

  describe('hides add button when delete button overlaps it', () => {
    it('hides one when two columns are selected', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, thEmpty, thEmpty), tr(tdEmpty, tdEmpty, tdEmpty)),
        ),
      );

      const floatingControls = mountWithIntl(
        <ColumnControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      selectColumns([0, 1])(editorView.state, editorView.dispatch);

      // set numberOfColumns prop to trick shouldComponentUpdate and force re-render
      floatingControls.setProps({ numberOfColumns: 3 });

      expect(
        floatingControls
          .find(ColumnControlsButtonWrap)
          .first()
          .find(InsertColumnButton).length,
      ).toBe(0);

      floatingControls.unmount();
    });
  });

  describe('hides add button when isResizing prop is truthy', () => {
    it('hides add button when isResizing is truthy', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mountWithIntl(
        <ColumnControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          isResizing={true}
        />,
      );

      expect(floatingControls.find(InsertColumnButtonInner).length).toBe(0);

      floatingControls.unmount();
    });
  });

  describe('column shift selection', () => {
    it('should shift select columns after the currently selected column', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty, thEmpty),
          ),
        ),
      );

      selectColumns([0])(editorView.state, editorView.dispatch);
      const floatingControls = mountWithIntl(
        <ColumnControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      floatingControls
        .find(ControlsButton)
        .at(2)
        .simulate('click', { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });

    it('should shift select columns before the currently selected column', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty, thEmpty),
          ),
        ),
      );

      selectColumns([2])(editorView.state, editorView.dispatch);
      const floatingControls = mountWithIntl(
        <ColumnControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      floatingControls
        .find(ControlsButton)
        .first()
        .simulate('click', { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });
  });
});
