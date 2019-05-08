// #region Imports
import { Decoration } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { findTable, getCellsInColumn, getCellsInRow } from 'prosemirror-utils';

import { Command } from '../../../types';
import { pluginKey, ACTIONS } from '../pm-plugins/main';
import {
  TableCssClassName as ClassName,
  TableDecorations,
  Cell,
} from '../types';
// #endregion

// #region Utils
export const createControlsHoverDecoration = (
  cells: Cell[],
  danger?: boolean,
): Decoration[] => {
  const deco = cells.map(cell => {
    const classes = [ClassName.HOVERED_CELL];
    if (danger) {
      classes.push('danger');
    }

    return Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: classes.join(' '),
      },
      { key: TableDecorations.CONTROLS_HOVER },
    );
  });

  return deco;
};
// #endregion

// #region Actions
export const hoverColumns = (
  hoveredColumns: number[],
  isInDanger?: boolean,
): Command => (state, dispatch) => {
  const cells = getCellsInColumn(hoveredColumns)(state.selection);
  if (!cells) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_COLUMNS,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, isInDanger),
            hoveredColumns,
            isInDanger,
          },
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const hoverRows = (
  hoveredRows: number[],
  isInDanger?: boolean,
): Command => (state, dispatch) => {
  const cells = getCellsInRow(hoveredRows)(state.selection);
  if (!cells) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_ROWS,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, isInDanger),
            hoveredRows,
            isInDanger,
          },
        })
        .setMeta('addToHistory', false),
    );
  }

  return true;
};

export const hoverTable = (isInDanger?: boolean): Command => (
  state,
  dispatch,
) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const map = TableMap.get(table.node);
  const hoveredColumns = Array.from(Array(map.width).keys());
  const hoveredRows = Array.from(Array(map.height).keys());
  const cells = getCellsInRow(hoveredRows)(state.selection);
  if (!cells) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_TABLE,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, isInDanger),
            hoveredColumns,
            hoveredRows,
            isInDanger,
          },
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};
// #endregion
