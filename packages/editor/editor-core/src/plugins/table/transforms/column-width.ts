import { TableMap } from 'prosemirror-tables';
import { Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { ResizeState } from '../pm-plugins/table-resizing/utils';

export const updateColumnWidths = (
  resizeState: ResizeState,
  table: PMNode,
  start: number,
) => (tr: Transaction): Transaction => {
  const map = TableMap.get(table);

  for (let i = 0; i < resizeState.cols.length; i++) {
    const width = resizeState.cols[i].width;
    // we need to recalculate table node to pick up attributes from the previous loop iteration
    table = tr.doc.nodeAt(start - 1) as PMNode;
    if (!table) {
      return tr;
    }

    for (let row = 0; row < map.height; row++) {
      let mapIndex = row * map.width + i;
      // Rowspanning cell that has already been handled
      if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) {
        continue;
      }
      const pos = map.map[mapIndex];
      const { attrs } = table.nodeAt(pos) || { attrs: {} };
      const index = attrs.colspan === 1 ? 0 : i - map.colCount(pos);

      if (attrs.colwidth && attrs.colwidth[index] === width) {
        continue;
      }

      const colwidth = attrs.colwidth
        ? attrs.colwidth.slice()
        : Array.from({ length: attrs.colspan }, _ => 0);

      colwidth[index] = width;
      tr.setNodeMarkup(start + pos, undefined, { ...attrs, colwidth });
    }
  }

  return tr;
};
