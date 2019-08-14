import { Node as PMNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import {
  findTable,
  convertTableNodeToArrayOfRows,
  convertArrayOfRowsToTableNode,
  isCellSelection,
  getSelectionRect,
  findCellRectClosestToPos,
} from 'prosemirror-utils';
import { compareNodes } from '../utils';

import { TablePluginState, SortOrder } from '../types';
import { getPluginState } from '../pm-plugins/main';
import { Command } from '../../../types';
import { TableMap } from 'prosemirror-tables';

export const sortByColumn = (
  columnIndex: number,
  order: SortOrder = SortOrder.DESC,
): Command => (state, dispatch) => {
  const { tr } = state;
  const table = findTable(tr.selection)!;
  if (!table || !table.node) {
    return false;
  }

  const selectionRect = isCellSelection(tr.selection)
    ? getSelectionRect(tr.selection)!
    : findCellRectClosestToPos(tr.selection.$from);

  if (!selectionRect) {
    return false;
  }

  const tablePluginState: TablePluginState = getPluginState(state);
  const tableArray = convertTableNodeToArrayOfRows(table.node);

  let headerRow;
  if (tablePluginState.isHeaderRowEnabled) {
    headerRow = tableArray.shift();
  }
  const sortedTable = tableArray.sort(
    (rowA: Array<PMNode | null>, rowB: Array<PMNode | null>) =>
      (order === SortOrder.DESC ? -1 : 1) *
      compareNodes(rowA[columnIndex], rowB[columnIndex]),
  );

  if (headerRow) {
    sortedTable.unshift(headerRow);
  }

  const newTableNode = convertArrayOfRowsToTableNode(table.node, sortedTable);

  tr.replaceWith(table.pos, table.pos + table.node.nodeSize, newTableNode);

  if (dispatch) {
    const pos = TableMap.get(table.node).positionAt(
      selectionRect.top,
      columnIndex,
      table.node,
    );

    dispatch(
      tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))),
    );
  }

  return true;
};
