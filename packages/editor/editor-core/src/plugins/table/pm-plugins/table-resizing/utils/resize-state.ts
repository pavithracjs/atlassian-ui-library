import { Node as PMNode } from 'prosemirror-model';
import { growColumn, shrinkColumn } from './resize-logic';
import {
  ColumnState,
  getCellsRefsInColumn,
  getColumnStateFromDOM,
} from './column-state';
import { insertColgroupFromNode } from './colgroup';

export interface ResizeState {
  cols: ColumnState[];
  maxSize: number;
  colgroupChildren: HTMLCollection;
}

export const getResizeStateFromDOM = ({
  minWidth,
  maxSize,
  table,
  tableRef,
  start,
  domAtPos,
}: {
  minWidth: number;
  maxSize: number;
  table: PMNode;
  tableRef: HTMLTableElement;
  start: number;
  domAtPos: (pos: number) => { node: Node; offset: number };
}): ResizeState => {
  const colgroupChildren = insertColgroupFromNode(tableRef, table);

  return {
    // update state from DOM
    cols: Array.from(colgroupChildren).map((_, index) => {
      const cellsRefs = getCellsRefsInColumn(index, table, start, domAtPos);
      return getColumnStateFromDOM(cellsRefs, index, minWidth);
    }),
    maxSize,
    colgroupChildren,
  };
};

// Resize a given column by an amount from the current state
export const resizeColumn = (
  resizeState: ResizeState,
  colIndex: number,
  amount: number,
): ResizeState => {
  const newState =
    amount > 0
      ? growColumn(resizeState, colIndex, amount)
      : amount < 0
      ? shrinkColumn(resizeState, colIndex, amount)
      : resizeState;

  updateColgroup(newState);

  return newState;
};

// updates Colgroup DOM node with new widths
export const updateColgroup = (state: ResizeState): void => {
  state.cols
    .filter(column => !!column.width) // if width is 0, we dont want to apply that.
    .forEach((column, i) => {
      (state.colgroupChildren[i] as HTMLElement).style.width = `${
        column.width
      }px`;
    });
};

export const getTotalWidth = ({ cols }: ResizeState): number => {
  return cols.reduce((totalWidth, col) => totalWidth + col.width, 0);
};
