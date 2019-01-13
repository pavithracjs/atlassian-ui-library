import { TableMap, addRow, addColumn } from 'prosemirror-tables';
import {
  findTable,
  getCellsInRow,
  safeInsert,
  setCellAttrs,
  getCellsInColumn,
} from 'prosemirror-utils';
import { Node as PMNode } from 'prosemirror-model';

export const addRowAt = rowIndex => tr => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);

    if (rowIndex >= 0 && rowIndex <= map.height) {
      return cloneRowAt(rowIndex)(tr);
    }
  }

  return tr;
};

export const addColumnAt = columnIndex => tr => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);

    if (columnIndex >= 0 && columnIndex <= map.width) {
      tr = cloneColumnAt(columnIndex)(tr);
    }
  }
  return tr;
};

const getCellsByPos = cellsArray => {
  const cellsByPos = {};
  cellsArray.forEach(cell => {
    cellsByPos[cell.pos] = cell;
  });
  return cellsByPos;
};

const cloneRowAt = rowIndex => tr => {
  const table = findTable(tr.selection);
  if (!table) {
    return tr;
  }

  const map = TableMap.get(table.node);
  const cloneRowIndex = rowIndex > 0 ? rowIndex - 1 : 0;
  if (cloneRowIndex < 0 || cloneRowIndex > map.height - 1) {
    return tr;
  }

  // Re-create the same nodes with same attrs, dropping the node content.
  const { schema } = tr.doc.type;
  const cloneRow = table.node.child(cloneRowIndex);
  const cells: any = [];
  let rowWidth = 0;
  const cloneRowCells = getCellsInRow(cloneRowIndex)(tr.selection);
  if (cloneRowCells) {
    cloneRowCells.forEach(cell => {
      for (let colIndex = 0; colIndex < map.width; colIndex++) {
        const cellPos =
          map.map[colIndex + cloneRowIndex * map.width] + table.start;
        if (cell.pos === cellPos) {
          // If we're copying a row with rowspan somewhere, we dont want to copy that cell
          // We'll increment its span below.
          if (cell.node.attrs.rowspan === 1) {
            rowWidth += cell.node.attrs.colspan;
            cells[colIndex] = schema.nodes.tableCell.createAndFill(
              cell.node.attrs,
              cell.node.marks,
            );
          } else if (rowIndex === 0) {
            cells[colIndex] = schema.nodes.tableCell.createAndFill(
              {
                ...cell.node.attrs,
                rowspan: 1,
              },
              cell.node.marks,
            );
          }
          break;
        }
      }
    });
  }

  // If a higher row spans past our clone row, bump the higher row to cover this new row too.
  // unless we're clonning the last merged row
  if (rowIndex > 0 && rowWidth < map.width) {
    const rowSpanCells: any = [];
    for (let i = cloneRowIndex; i >= 0; i--) {
      const rowCells = getCellsInRow(i)(tr.selection);
      if (rowCells) {
        rowCells.forEach(cell => {
          const { rowspan } = cell.node.attrs;
          const spanRange = i + rowspan - 1;
          if (rowspan > 1) {
            if (spanRange > cloneRowIndex) {
              rowSpanCells.push(cell);
            } else if (spanRange === cloneRowIndex) {
              for (let colIndex = 0; colIndex < map.width; colIndex++) {
                const cellPos = map.map[colIndex + i * map.width] + table.start;
                if (cell.pos === cellPos) {
                  const newCell = schema.nodes.tableCell.createAndFill(
                    {
                      ...cell.node.attrs,
                      rowspan: 1,
                    },
                    cell.node.marks,
                  );
                  cells[colIndex] = newCell;
                  break;
                }
              }
            }
          }
        });
      }
    }

    if (rowSpanCells.length) {
      rowSpanCells.forEach(cell => {
        tr = setCellAttrs(cell, {
          rowspan: cell.node.attrs.rowspan + 1,
        })(tr);
      });
    }
  }

  let insertionPos = table.start;
  if (rowIndex > 0) {
    for (let i = 0; i < cloneRowIndex + 1; i++) {
      insertionPos += table.node.child(i).nodeSize;
    }
  }

  return safeInsert(
    schema.nodes.tableRow.create(
      cloneRow.attrs,
      [...cells].filter(cell => !!cell),
    ),
    insertionPos,
  )(tr);
};

const cloneColumnAt = insertColumnIndex => tr => {
  const table = findTable(tr.selection);
  if (!table) {
    return tr;
  }

  const map = TableMap.get(table.node);
  const cloneColumnIndex = insertColumnIndex > 0 ? insertColumnIndex - 1 : 0;
  if (cloneColumnIndex < 0 || cloneColumnIndex > map.width - 1) {
    return tr;
  }

  const { schema } = tr.doc.type;
  const rows: PMNode[] = [];
  const columnCells = getCellsInColumn(cloneColumnIndex)(tr.selection);
  if (!columnCells) {
    return tr;
  }
  const columnCellsByPos = getCellsByPos(columnCells);

  // loop through rows
  for (let rowIndex = 0; rowIndex < table.node.childCount; rowIndex++) {
    let rowCells: any[] = [];
    const row = table.node.child(rowIndex);
    const cells = getCellsInRow(rowIndex)(tr.selection);
    if (!cells) {
      continue;
    }
    const rowCellsByPos = getCellsByPos(cells);
    const byPos = { ...rowCellsByPos };
    Object.keys(byPos).forEach(pos => {
      for (let colIndex = 0; colIndex < map.width; colIndex++) {
        const cellPos = map.map[colIndex + rowIndex * map.width] + table.start;
        if (byPos[cellPos]) {
          rowCells[colIndex] = byPos[cellPos].node;
          byPos[cellPos] = null;
        }
      }
    });

    let skip = false;
    // loop through rows up from the current row to check if there's a row with rowspan spanning the current row
    if (rowIndex > 0) {
      for (let i = rowIndex - 1; i >= 0; i--) {
        const prevRowCells = getCellsInRow(i)(tr.selection);
        if (prevRowCells) {
          prevRowCells.forEach(prevRowCell => {
            if (columnCellsByPos[prevRowCell.pos]) {
              const prevCell = columnCellsByPos[prevRowCell.pos];
              const spanRange = i + prevCell.node.attrs.rowspan - 1;
              if (spanRange >= rowIndex) {
                skip = true;
              }
            }
          });
        }
      }
    }

    // loop through columns back to check if there's a column with colspan spanning the current column
    if (!skip && insertColumnIndex > 0) {
      const byPos = { ...rowCellsByPos };
      for (let i = 0; i < insertColumnIndex; i++) {
        const cellPos = map.map[i + rowIndex * map.width] + table.start;
        const prevCell = byPos[cellPos];
        if (prevCell) {
          byPos[cellPos] = null;

          const spanRange = i + prevCell.node.attrs.colspan - 1;
          if (spanRange > cloneColumnIndex) {
            const prevCopyCell = rowCells[i];
            rowCells[i] = schema.nodes[prevCopyCell.type.name].createAndFill(
              {
                ...prevCopyCell.attrs,
                cellType: 'normal',
                colspan: prevCopyCell.attrs.colspan + 1,
                colwidth: prevCopyCell.attrs.colwidth ? [48] : null,
              },
              prevCopyCell.marks,
            );
            skip = true;
          }
        }
      }
    }

    if (!skip) {
      const cellPos =
        map.positionAt(rowIndex, cloneColumnIndex, table.node) + table.start;
      const copyCell = rowCellsByPos[cellPos];
      const newCell = schema.nodes[copyCell.node.type.name].createAndFill(
        {
          ...copyCell.node.attrs,
          cellType: 'normal',
          colspan: 1,
          colwidth: copyCell.node.attrs.colwidth ? [48] : null,
        },
        copyCell.node.marks,
      );
      let insertIndex = insertColumnIndex;
      if (insertIndex > 0) {
        const cellsbyPos = { ...rowCellsByPos };
        for (let i = insertColumnIndex - 1; i >= 0; i--) {
          const cellPos = map.positionAt(rowIndex, i, table.node) + table.start;
          const prevCell = cellsbyPos[cellPos];
          if (prevCell && prevCell.node.attrs.colspan > 1) {
            cellsbyPos[cellPos] = null;
            insertIndex -= prevCell.node.attrs.colspan - 1;
          }
        }
      }
      if (!rowCells[insertIndex]) {
        rowCells[insertIndex] = newCell;
      } else {
        rowCells.splice(insertIndex, 0, newCell);
      }
    }

    rows.push(
      schema.nodes.tableRow.createChecked(
        row.attrs,
        [...rowCells].filter(cell => !!cell),
      ),
    );
  }

  const newTable = schema.nodes.table.createChecked(
    table.node.attrs,
    rows,
    table.node.marks,
  );

  return tr.replaceWith(table.pos, table.pos + table.node.nodeSize, newTable);
};
