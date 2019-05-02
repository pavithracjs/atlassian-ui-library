// #region Imports
import { Transaction, TextSelection, Selection } from 'prosemirror-state';
import {
  goToNextCell as baseGotoNextCell,
  selectionCell,
  TableMap,
  CellSelection,
} from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode, Slice, Schema } from 'prosemirror-model';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  addColumnAt,
  addRowAt,
  isCellSelection,
  removeTable,
  findParentNodeOfType,
  safeInsert,
  createTable as createTableNode,
  findCellClosestToPos,
  setCellAttrs,
  getSelectionRect,
  selectColumn as selectColumnTransform,
  selectRow as selectRowTransform,
} from 'prosemirror-utils';
import { getPluginState, pluginKey, ACTIONS } from '../pm-plugins/main';
import { checkIfHeaderRowEnabled, isIsolating } from '../utils';
import { Command } from '../../../types';
import { analyticsService } from '../../../analytics';
import { outdentList } from '../../lists/commands';
import { mapSlice } from '../../../utils/slice';
import { fixAutoSizedTable } from '../transforms';
import { INPUT_METHOD } from '../../analytics';
import { insertRowWithAnalytics } from '../actions-with-analytics';
// #endregion

// #region Constants
const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;
// #endregion

// #region Actions
export const setCellAttr = (name: string, value: any): Command => (
  state,
  dispatch,
) => {
  const { tr, selection } = state;
  if (selection instanceof CellSelection) {
    let updated = false;
    selection.forEachCell((cell, pos) => {
      if (cell.attrs[name] !== value) {
        tr.setNodeMarkup(pos, cell.type, { ...cell.attrs, [name]: value });
        updated = true;
      }
    });
    if (updated) {
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }
  } else {
    const cell: any = selectionCell(state);
    if (cell) {
      if (dispatch) {
        dispatch(
          tr.setNodeMarkup(cell.pos, cell.nodeAfter.type, {
            ...cell.nodeAfter.attrs,
            [name]: value,
          }),
        );
      }
      return true;
    }
  }
  return false;
};

export const insertColumn = (column: number): Command => (state, dispatch) => {
  const tr = addColumnAt(column)(state.tr);
  const table = findTable(tr.selection)!;
  // move the cursor to the newly created column
  const pos = TableMap.get(table.node).positionAt(0, column, table.node);
  if (dispatch) {
    dispatch(
      tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))),
    );
  }
  return true;
};

export const insertRow = (row: number): Command => (state, dispatch) => {
  // Dont clone the header row
  const headerRowEnabled = checkIfHeaderRowEnabled(state);
  const clonePreviousRow =
    (headerRowEnabled && row > 1) || (!headerRowEnabled && row >= 0);

  const tr = addRowAt(row, clonePreviousRow)(state.tr);

  const table = findTable(tr.selection)!;
  // move the cursor to the newly created row
  const pos = TableMap.get(table.node).positionAt(row, 0, table.node);

  if (dispatch) {
    dispatch(
      tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))),
    );
  }
  return true;
};

export const triggerUnlessTableHeader = (command: Command): Command => (
  state,
  dispatch,
) => {
  const {
    selection,
    schema: {
      nodes: { tableHeader },
    },
  } = state;

  if (selection instanceof TextSelection) {
    const cell = findCellClosestToPos(selection.$from);
    if (cell && cell.node.type !== tableHeader) {
      return command(state, dispatch);
    }
  }

  if (selection instanceof CellSelection) {
    const rect = getSelectionRect(selection);
    if (!checkIfHeaderRowEnabled(state) || (rect && rect.top > 0)) {
      return command(state, dispatch);
    }
  }

  return false;
};

export const transformSliceToAddTableHeaders = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { table, tableHeader, tableRow } = schema.nodes;

  return mapSlice(slice, maybeTable => {
    if (maybeTable.type === table) {
      const firstRow = maybeTable.firstChild;
      if (firstRow) {
        const headerCols = [] as PMNode[];
        firstRow.forEach(oldCol => {
          headerCols.push(
            tableHeader.createChecked(
              oldCol.attrs,
              oldCol.content,
              oldCol.marks,
            ),
          );
        });
        const headerRow = tableRow.createChecked(
          firstRow.attrs,
          headerCols,
          firstRow.marks,
        );
        return maybeTable.copy(maybeTable.content.replaceChild(0, headerRow));
      }
    }
    return maybeTable;
  });
};

export const deleteTable: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeTable(state.tr));
  }
  return true;
};

export const convertFirstRowToHeader = (schema: Schema) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection)!;
  const map = TableMap.get(table.node);
  for (let i = 0; i < map.width; i++) {
    const cell = table.node.child(0).child(i);
    tr.setNodeMarkup(
      table.start + map.map[i],
      schema.nodes.tableHeader,
      cell.attrs,
    );
  }
  return tr;
};

export const createTable: Command = (state, dispatch) => {
  if (!pluginKey.get(state)) {
    return false;
  }
  const table = createTableNode(state.schema);

  if (dispatch) {
    dispatch(safeInsert(table)(state.tr).scrollIntoView());
  }
  return true;
};

export const goToNextCell = (direction: number): Command => (
  state,
  dispatch,
) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const map = TableMap.get(table.node);
  const { tableCell, tableHeader } = state.schema.nodes;
  const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;
  const firstCellPos = map.positionAt(0, 0, table.node) + table.start;
  const lastCellPos =
    map.positionAt(map.height - 1, map.width - 1, table.node) + table.start;

  if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, 0)(state, dispatch);
    return true;
  }

  if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, map.height)(state, dispatch);
    return true;
  }

  const event =
    direction === TAB_FORWARD_DIRECTION ? 'next_cell' : 'previous_cell';
  analyticsService.trackEvent(
    `atlassian.editor.format.table.${event}.keyboard`,
  );

  return baseGotoNextCell(direction)(state, dispatch);
};

export const moveCursorBackward: Command = (state, dispatch) => {
  const pluginState = getPluginState(state);
  const { $cursor } = state.selection as TextSelection;
  // if cursor is in the middle of a text node, do nothing
  if (
    !$cursor ||
    (pluginState.view
      ? !pluginState.view.endOfTextblock('backward', state)
      : $cursor.parentOffset > 0)
  ) {
    return false;
  }

  // find the node before the cursor
  let before;
  let cut: number | undefined;
  if (!isIsolating($cursor.parent)) {
    for (let i = $cursor.depth - 1; !before && i >= 0; i--) {
      if ($cursor.index(i) > 0) {
        cut = $cursor.before(i + 1);
        before = $cursor.node(i).child($cursor.index(i) - 1);
      }
      if (isIsolating($cursor.node(i))) {
        break;
      }
    }
  }

  // if the node before is not a table node - do nothing
  if (!before || before.type !== state.schema.nodes.table) {
    return false;
  }

  /*
    ensure we're just at a top level paragraph
    otherwise, perform regular backspace behaviour
   */
  const grandparent = $cursor.node($cursor.depth - 1);
  const { listItem } = state.schema.nodes;

  if (
    $cursor.parent.type !== state.schema.nodes.paragraph ||
    (grandparent && grandparent.type !== state.schema.nodes.doc)
  ) {
    if (grandparent && grandparent.type === listItem) {
      return outdentList()(state, dispatch);
    } else {
      return false;
    }
  }

  const { tr } = state;
  const lastCellPos = (cut || 0) - 4;
  // need to move cursor inside the table to be able to calculate table's offset
  tr.setSelection(new TextSelection(state.doc.resolve(lastCellPos)));
  const { $from } = tr.selection;
  const start = $from.start(-1);
  const pos = start + $from.parent.nodeSize - 1;
  // move cursor to the last cell
  // it doesn't join node before (last cell) with node after (content after the cursor)
  // due to ridiculous amount of PM code that would have been required to overwrite
  if (dispatch) {
    dispatch(tr.setSelection(new TextSelection(state.doc.resolve(pos))));
  }

  return true;
};

export const setMultipleCellAttrs = (
  attrs: Object,
  targetCellPosition?: number,
): Command => (state, dispatch) => {
  let cursorPos: number | undefined;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((cell, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetCellPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1))!;
    tr = setCellAttrs(cell, attrs)(tr);
    cursorPos = cell.pos;
  }

  if (tr.docChanged && cursorPos !== undefined) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos!));

    if (dispatch) {
      dispatch(tr.setSelection(Selection.near($pos)));
    }
    return true;
  }
  return false;
};

export const setEditorFocus = (editorHasFocus: boolean): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(pluginKey, {
        action: ACTIONS.SET_EDITOR_FOCUS,
        data: { editorHasFocus },
      }),
    );
  }
  return true;
};

export const setTableRef = (tableRef?: HTMLElement | null): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.SET_TABLE_REF,
          data: { tableRef },
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const selectColumn = (column: number): Command => (state, dispatch) => {
  const tr = selectColumnTransform(column)(state.tr);

  let targetCellPosition;
  const cells = getCellsInColumn(column)(tr.selection);
  if (cells && cells.length) {
    targetCellPosition = cells[0].pos;
  }
  // update contextual menu target cell position on column selection
  if (dispatch) {
    dispatch(
      tr
        .setMeta(pluginKey, {
          action: ACTIONS.SET_TARGET_CELL_POSITION,
          data: { targetCellPosition },
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const selectRow = (row: number): Command => (state, dispatch) => {
  const tr = selectRowTransform(row)(state.tr);

  let targetCellPosition;
  const cells = getCellsInRow(row)(tr.selection);
  if (cells && cells.length) {
    targetCellPosition = cells[0].pos;
  }
  // update contextual menu target cell position on row selection
  if (dispatch) {
    dispatch(
      tr
        .setMeta(pluginKey, {
          action: ACTIONS.SET_TARGET_CELL_POSITION,
          data: { targetCellPosition },
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const showInsertColumnButton = (columnIndex: number): Command => (
  state,
  dispatch,
) => {
  const { insertColumnButtonIndex } = getPluginState(state);
  if (columnIndex > -1 && insertColumnButtonIndex !== columnIndex) {
    if (dispatch) {
      dispatch(
        state.tr
          .setMeta(pluginKey, {
            action: ACTIONS.SHOW_INSERT_COLUMN_BUTTON,
            data: {
              insertColumnButtonIndex: columnIndex,
            },
          })
          .setMeta('addToHistory', false),
      );
    }
    return true;
  }
  return false;
};

export const showInsertRowButton = (rowIndex: number): Command => (
  state,
  dispatch,
) => {
  const { insertRowButtonIndex } = getPluginState(state);
  if (rowIndex > -1 && insertRowButtonIndex !== rowIndex) {
    if (dispatch) {
      dispatch(
        state.tr
          .setMeta(pluginKey, {
            action: ACTIONS.SHOW_INSERT_ROW_BUTTON,
            data: {
              insertRowButtonIndex: rowIndex,
            },
          })
          .setMeta('addToHistory', false),
      );
    }
    return true;
  }
  return false;
};

export const hideInsertColumnOrRowButton: Command = (state, dispatch) => {
  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );
  if (
    typeof insertColumnButtonIndex === 'number' ||
    typeof insertRowButtonIndex === 'number'
  ) {
    if (dispatch) {
      dispatch(
        state.tr
          .setMeta(pluginKey, {
            action: ACTIONS.HIDE_INSERT_COLUMN_OR_ROW_BUTTON,
          })
          .setMeta('addToHistory', false),
      );
    }
    return true;
  }

  return false;
};

export const autoSizeTable = (
  view: EditorView,
  node: PMNode,
  table: HTMLTableElement,
  basePos: number,
  opts: { dynamicTextSizing: boolean; containerWidth: number },
) => {
  view.dispatch(fixAutoSizedTable(view, node, table, basePos, opts));
  return true;
};
// #endregion
