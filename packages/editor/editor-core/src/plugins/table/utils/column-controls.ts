import {
  findTable,
  findDomRefAtPos,
  getSelectionRect,
  isColumnSelected,
  isTableSelected,
} from 'prosemirror-utils';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { tableDeleteButtonSize } from '../ui/styles';
import { hasTableBeenResized } from '../pm-plugins/table-resizing/utils';

export interface ColumnParams {
  startIndex: number;
  endIndex: number;
  width: number;
}

const getNodeWidth = (ref: HTMLElement): number => {
  const rect = ref.getBoundingClientRect();
  return rect ? rect.width : ref.offsetWidth;
};

// calculates the width of each column control button
export const getColumnsWidths = (
  state: EditorState,
  domAtPos: (pos: number) => { node: Node; offset: number },
): number[] => {
  const { selection, doc } = state;
  const widths: number[] = [];
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const tableRef = findDomRefAtPos(table.pos, domAtPos) as HTMLElement;
    const tableWidth = getNodeWidth(tableRef);
    const averageColWidth = tableWidth / map.width;

    for (let i = 0; i < map.width; i++) {
      const cells = map.cellsInRect({
        top: 0,
        bottom: map.height,
        left: i,
        right: i + 1,
      });
      if (hasTableBeenResized(table.node)) {
        const cols = tableRef.querySelectorAll('col');
        const colWidth = cols[i]
          ? parseInt(cols[i].style.width || '0', 10)
          : averageColWidth;
        widths.push(colWidth + 1);
      } else {
        let minColSpan;
        let cellPos = cells[0];
        for (let j = 0, count = cells.length; j < count; j++) {
          const pos = cells[j] + table.start;
          const cell = doc.nodeAt(pos);
          if (cell && (!minColSpan || minColSpan > cell.attrs.colspan)) {
            minColSpan = cell.attrs.colspan;
            cellPos = pos;
          }
        }
        if (minColSpan === 1) {
          const cellRef = findDomRefAtPos(cellPos, domAtPos) as HTMLElement;
          widths.push(getNodeWidth(cellRef) + 1);
        } else {
          widths.push(averageColWidth + 1);
        }
      }
    }

    return widths;
  }

  return [];
};

export const isColumnInsertButtonVisible = (
  index: number,
  selection: Selection,
): boolean => {
  const rect = getSelectionRect(selection);
  if (
    rect &&
    selection instanceof CellSelection &&
    selection.isColSelection() &&
    !isTableSelected(selection) &&
    rect.right - index === index - rect.left
  ) {
    return false;
  }
  return true;
};

export const isColumnDeleteButtonVisible = (selection: Selection): boolean => {
  if (
    !isTableSelected(selection) &&
    (selection instanceof CellSelection && selection.isColSelection())
  ) {
    return true;
  }

  return false;
};

export const getColumnDeleteButtonParams = (
  columnsWidths: Array<number | undefined>,
  selection: Selection,
): { left: number; indexes: number[] } | null => {
  const rect = getSelectionRect(selection);
  if (!rect) {
    return null;
  }
  let width = 0;
  let offset = 0;
  // find the columns before the selection
  for (let i = 0; i < rect.left; i++) {
    const colWidth = columnsWidths[i];
    if (colWidth) {
      offset += colWidth - 1;
    }
  }
  // these are the selected columns widths
  const indexes: number[] = [];
  for (let i = rect.left; i < rect.right; i++) {
    const colWidth = columnsWidths[i];
    if (colWidth) {
      width += colWidth;
      indexes.push(i);
    }
  }

  const left = offset + width / 2 - tableDeleteButtonSize / 2;
  return { left, indexes };
};

export const getColumnsParams = (
  columnsWidths: Array<number | undefined>,
): ColumnParams[] => {
  const columns: ColumnParams[] = [];
  for (let i = 0, count = columnsWidths.length; i < count; i++) {
    const width = columnsWidths[i];
    if (!width) {
      continue;
    }
    let endIndex = columnsWidths.length;
    for (let k = i + 1, count = columnsWidths.length; k < count; k++) {
      if (columnsWidths[k]) {
        endIndex = k;
        break;
      }
    }
    columns.push({ startIndex: i, endIndex, width });
  }
  return columns;
};

export const getColumnClassNames = (
  index: number,
  selection: Selection,
  hoveredColumns: number[] = [],
  isInDanger?: boolean,
  isResizing?: boolean,
): string => {
  const classNames: string[] = [];
  if (
    isColumnSelected(index)(selection) ||
    (hoveredColumns.indexOf(index) > -1 && !isResizing)
  ) {
    classNames.push('active');
    if (isInDanger) {
      classNames.push('danger');
    }
  }
  return classNames.join(' ');
};
