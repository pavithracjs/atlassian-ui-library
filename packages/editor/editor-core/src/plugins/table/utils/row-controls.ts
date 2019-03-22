import {
  getSelectionRect,
  isRowSelected,
  isTableSelected,
} from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
import { CellSelection } from 'prosemirror-tables';
import { tableDeleteButtonSize } from '../ui/styles';

export interface RowParams {
  startIndex: number;
  endIndex: number;
  height: number;
}

export const getRowHeights = (tableRef: HTMLTableElement): number[] => {
  const heights: number[] = [];
  const rows = tableRef.querySelectorAll('tr');
  for (let i = 0, count = rows.length; i < count; i++) {
    const rect = rows[i].getBoundingClientRect();
    heights[i] = (rect ? rect.height : rows[i].offsetHeight) + 1;
  }
  return heights;
};

export const isRowInsertButtonVisible = (
  index: number,
  selection: Selection,
): boolean => {
  const rect = getSelectionRect(selection);
  if (
    rect &&
    selection instanceof CellSelection &&
    selection.isRowSelection() &&
    !isTableSelected(selection) &&
    rect.bottom - index === index - rect.top
  ) {
    return false;
  }
  return true;
};

export const isRowDeleteButtonVisible = (selection: Selection): boolean => {
  if (isTableSelected(selection)) {
    return false;
  }

  const rect = getSelectionRect(selection);
  if (rect) {
    for (let i = rect.top; i < rect.bottom; i++) {
      if (isRowSelected(i)(selection)) {
        return true;
      }
    }
  }

  return false;
};

export const getRowDeleteButtonParams = (
  rowsHeights: Array<number | undefined>,
  selection: Selection,
): { top: number; indexes: number[] } | null => {
  const rect = getSelectionRect(selection);
  if (!rect) {
    return null;
  }
  let height = 0;
  let offset = 0;

  const indexes: number[] = [];
  for (let i = rect.top; i < rect.bottom; i++) {
    if (isRowSelected(i)(selection)) {
      indexes.push(i);
    }
  }
  // find the rows before the selection
  for (let i = 0; i < indexes[0]; i++) {
    const rowHeight = rowsHeights[i];
    if (rowHeight) {
      offset += rowHeight - 1;
    }
  }
  // selected rows heights
  for (let i = indexes[0]; i <= indexes[indexes.length - 1]; i++) {
    const rowHeight = rowsHeights[i];
    if (rowHeight) {
      height += rowHeight - 1;
    }
  }

  const top = offset + height / 2 - tableDeleteButtonSize / 2;
  return { top, indexes };
};

export const getRowsParams = (
  rowsHeights: Array<number | undefined>,
): RowParams[] => {
  const rows: RowParams[] = [];
  for (let i = 0, count = rowsHeights.length; i < count; i++) {
    const height = rowsHeights[i];
    if (!height) {
      continue;
    }
    let endIndex = rowsHeights.length;
    for (let k = i + 1, count = rowsHeights.length; k < count; k++) {
      if (rowsHeights[k]) {
        endIndex = k;
        break;
      }
    }
    rows.push({ startIndex: i, endIndex, height });
  }
  return rows;
};

export const getRowClassNames = (
  index: number,
  selection: Selection,
  hoveredRows: number[] = [],
  isInDanger?: boolean,
  isResizing?: boolean,
): string => {
  const classNames: string[] = [];
  const isHovered = hoveredRows.indexOf(index) > -1;

  if (isRowSelected(index)(selection) || (isHovered && !isResizing)) {
    classNames.push('active');
    if (isInDanger && isHovered) {
      classNames.push('danger');
    }
  }
  return classNames.join(' ');
};
