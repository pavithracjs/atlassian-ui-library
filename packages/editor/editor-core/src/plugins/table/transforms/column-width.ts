import { TableMap } from 'prosemirror-tables';
import { Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { CellAttributes } from '@atlaskit/adf-schema';
import { ResizeState } from '../pm-plugins/table-resizing/utils';

export const updateColumnWidths = (
  resizeState: ResizeState,
  table: PMNode,
  start: number,
) => (tr: Transaction): Transaction => {
  const map = TableMap.get(table);
  const updatedCellsAttrs: { [key: number]: CellAttributes } = {};
  const { selection } = tr;

  // calculating new attributes for each cell
  for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
    for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
      const { width } = resizeState.cols[columnIndex];
      const mapIndex = rowIndex * map.width + columnIndex;
      const cellPos = map.map[mapIndex];
      const attrs = updatedCellsAttrs[cellPos] || {
        ...table.nodeAt(cellPos)!.attrs,
      };

      // Rowspanning cell that has already been handled
      if (rowIndex && map.map[mapIndex] === map.map[mapIndex - map.width]) {
        continue;
      }
      const colspanIndex =
        attrs.colspan === 1 ? 0 : columnIndex - map.colCount(cellPos);
      if (attrs.colwidth && attrs.colwidth[colspanIndex] === width) {
        continue;
      }

      const colwidth = attrs.colwidth
        ? attrs.colwidth.slice()
        : Array.from({ length: attrs.colspan || 1 }, _ => 0);

      colwidth[colspanIndex] = width;
      updatedCellsAttrs[cellPos] = { ...attrs, colwidth };
    }
  }

  // updating all cells with new attributes
  const rows: PMNode[] = [];
  const seen: { [key: number]: boolean } = {};
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const row = table.child(rowIndex);
    const cells: PMNode[] = [];

    for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
      const mapIndex = rowIndex * map.width + columnIndex;
      const pos = map.map[mapIndex];
      const cell = table.nodeAt(pos);
      if (!seen[pos] && cell) {
        cells.push(
          cell.type.createChecked(
            updatedCellsAttrs[pos] || cell.attrs,
            cell.content,
            cell.marks,
          ),
        );
        seen[pos] = true;
      }
    }
    rows.push(row.type.createChecked(row.attrs, cells, row.marks));
  }

  const tablePos = start - 1;
  return (
    tr
      .replaceWith(
        tablePos,
        tablePos + table.nodeSize,
        table.type.createChecked(table.attrs, rows, table.marks),
      )
      // restore selection after replacing the table
      .setSelection(selection)
  );
};
