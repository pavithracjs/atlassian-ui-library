import { TableMap } from 'prosemirror-tables';
import { Node as PMNode } from 'prosemirror-model';
import { tableCellMinWidth } from '@atlaskit/editor-common';
import { Command, DomAtPos } from '../../../../types';
import { updateColumnWidths } from '../../transforms';

import {
  addContainerLeftRightPadding,
  resizeColumn,
  getResizeStateFromDOM,
  hasTableBeenResized,
  insertColgroupFromNode as recreateResizeColsByNode,
  ScaleOptions,
  scaleWithParent,
  scale,
} from './utils';

export const handleBreakoutContent = (
  tableRef: HTMLTableElement,
  cellPos: number,
  start: number,
  minWidth: number,
  table: PMNode,
  domAtPos: DomAtPos,
): Command => (state, dispatch) => {
  const map = TableMap.get(table);
  const rect = map.findCell(cellPos - start);
  const cellStyle = getComputedStyle(tableRef);
  const amount = addContainerLeftRightPadding(
    minWidth - tableRef.offsetWidth,
    cellStyle,
  );

  while (tableRef.nodeName !== 'TABLE') {
    tableRef = tableRef.parentNode as HTMLTableElement;
  }

  const resizeState = resizeColumn(
    getResizeStateFromDOM({
      minWidth: tableCellMinWidth,
      maxSize: tableRef.offsetWidth,
      table,
      tableRef,
      start,
      domAtPos,
    }),
    rect.left,
    amount,
  );

  const { tr } = state;
  updateColumnWidths(resizeState, table, start)(tr);

  if (dispatch && tr.docChanged) {
    dispatch(tr);
  }

  return true;
};

// Scale the table to meet new requirements (col, layout change etc)
export const scaleTable = (
  tableRef: HTMLTableElement | null | undefined,
  options: ScaleOptions,
  domAtPos: DomAtPos,
): Command => (state, dispatch) => {
  if (!tableRef) {
    return false;
  }

  const { node, start, parentWidth } = options;

  // If a table has not been resized yet, columns should be auto.
  if (hasTableBeenResized(node) === false) {
    // If its not a re-sized table, we still want to re-create cols
    // To force reflow of columns upon delete.
    recreateResizeColsByNode(tableRef, node);
    return false;
  }

  let resizeState;
  if (parentWidth) {
    resizeState = scaleWithParent(tableRef, parentWidth, node, start, domAtPos);
  } else {
    resizeState = scale(tableRef, options, domAtPos);
  }

  if (resizeState) {
    let { tr } = state;
    tr = updateColumnWidths(resizeState, node, start)(tr);

    if (tr.docChanged && dispatch) {
      dispatch(tr);
      return true;
    }
  }

  return false;
};
