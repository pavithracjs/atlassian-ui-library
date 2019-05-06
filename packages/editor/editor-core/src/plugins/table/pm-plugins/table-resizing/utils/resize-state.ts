import { Node as PMNode } from 'prosemirror-model';
import { reduceSpace, growColumn, shrinkColumn } from './resize-logic';
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
  state: ResizeState,
  colIndex: number,
  amount: number,
): ResizeState => {
  const newState =
    amount > 0
      ? growColumn(state, colIndex, amount)
      : amount < 0
      ? shrinkColumn(state, colIndex, amount)
      : state;

  updateColgroup(newState);

  return newState;
};

// Scale the table to a given size and colgroup DOM
export const scaleTable = (
  state: ResizeState,
  newWidth: number,
): ResizeState => {
  const scaleFactor = newWidth / getTotalWidth(state);

  const newState = {
    ...state,
    maxSize: newWidth,
    cols: state.cols.map(col => {
      const { minWidth, width } = col;
      let newColWidth = Math.floor(width * scaleFactor);

      // enforce min width
      if (newColWidth < minWidth) {
        newColWidth = minWidth;
      }

      return { ...col, width: newColWidth };
    }),
  };

  if (getTotalWidth(newState) > newWidth) {
    return reduceSpace(newState, getTotalWidth(newState) - newWidth);
  }

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
