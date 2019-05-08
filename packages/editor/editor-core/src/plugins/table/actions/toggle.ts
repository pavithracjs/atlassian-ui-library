//#region Imports
import { TableMap } from 'prosemirror-tables';
import { NodeType } from 'prosemirror-model';
import { findTable } from 'prosemirror-utils';
import { TableLayout } from '@atlaskit/adf-schema';
import { pluginKey, ACTIONS } from '../pm-plugins/main';
import { checkIfHeaderRowEnabled, checkIfHeaderColumnEnabled } from '../utils';
import { Command } from '../../../types';
//#endregion

// #region Utils
/**
 * Table layout toggle logic
 * default -> wide -> full-width -> default
 */
export const getNextLayout = (currentLayout: TableLayout): TableLayout => {
  switch (currentLayout) {
    case 'default':
      return 'wide';
    case 'wide':
      return 'full-width';
    case 'full-width':
      return 'default';
    default:
      return 'default';
  }
};

const changeCellsType = (
  cellsPositions: number[],
  newType: NodeType,
  tableStart: number,
): Command => (state, dispatch) => {
  const { tr } = state;

  cellsPositions.forEach(relativeCellPos => {
    const cellPos = relativeCellPos + tableStart;
    const cell = tr.doc.nodeAt(cellPos);

    if (cell) {
      tr.setNodeMarkup(cellPos, newType, cell.attrs);
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};
// #endregion

// #region Actions
export const toggleHeaderRow: Command = (state, dispatch) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { tableHeader, tableCell } = state.schema.nodes;
  const map = TableMap.get(table.node);
  const cellPositions = map.cellsInRect({
    left: checkIfHeaderColumnEnabled(state) ? 1 : 0,
    top: 0,
    right: map.width,
    bottom: 1,
  });

  const type = checkIfHeaderRowEnabled(state) ? tableCell : tableHeader;
  return changeCellsType(cellPositions, type, table.start)(state, dispatch);
};

export const toggleHeaderColumn: Command = (state, dispatch) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { tableHeader, tableCell } = state.schema.nodes;
  const map = TableMap.get(table.node);
  const cellsPositions = map.cellsInRect({
    left: 0,
    // skip header row
    top: checkIfHeaderRowEnabled(state) ? 1 : 0,
    right: 1,
    bottom: map.height,
  });

  const type = checkIfHeaderColumnEnabled(state) ? tableCell : tableHeader;
  return changeCellsType(cellsPositions, type, table.start)(state, dispatch);
};

export const toggleNumberColumn: Command = (state, dispatch) => {
  const { tr } = state;
  const { node, pos } = findTable(state.selection)!;

  tr.setNodeMarkup(pos, state.schema.nodes.table, {
    ...node.attrs,
    isNumberColumnEnabled: !node.attrs.isNumberColumnEnabled,
  });

  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

export const toggleTableLayout: Command = (state, dispatch): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const layout = getNextLayout(table.node.attrs.layout);

  if (dispatch) {
    dispatch(
      state.tr.setNodeMarkup(table.pos, state.schema.nodes.table, {
        ...table.node.attrs,
        layout,
      }),
    );
  }
  return true;
};

export const toggleContextualMenu: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.TOGGLE_CONTEXTUAL_MENU,
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};
// #endregion
