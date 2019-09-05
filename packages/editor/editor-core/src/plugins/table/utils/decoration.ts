import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { NodeWithPos, getSelectionRect, findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
import { CellAttributes } from '@atlaskit/adf-schema';
import { tableResizeHandleWidth } from '@atlaskit/editor-common';
import {
  TableCssClassName as ClassName,
  TableDecorations,
  Cell,
} from '../types';
import { getPluginState } from '../pm-plugins/main';

const filterDecorationByKey = (
  key: TableDecorations,
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(undefined, undefined, spec => spec.key.indexOf(key) > -1);

const createResizeHandleNode = (
  colIndex: number,
  colSpanIndex: number,
): HTMLElement => {
  const node = document.createElement('div');
  node.classList.add(ClassName.RESIZE_HANDLE);
  node.setAttribute('data-col-index', `${colIndex}`);
  // index within a merged column
  node.setAttribute('data-colspan-index', `${colSpanIndex}`);
  return node;
};

export const findColumnControlSelectedDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  filterDecorationByKey(TableDecorations.COLUMN_SELECTED, decorationSet);

export const findControlsHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  filterDecorationByKey(TableDecorations.ALL_CONTROLS_HOVER, decorationSet);

export const createCellHoverDecoration = (
  cells: Cell[],
  type: 'warning',
): Decoration[] =>
  cells.map(cell =>
    Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: ClassName.HOVERED_CELL_WARNING,
      },
      {
        key: TableDecorations.CELL_CONTROLS_HOVER,
      },
    ),
  );

export const createControlsHoverDecoration = (
  cells: Cell[],
  type: 'row' | 'column' | 'table',
  danger?: boolean,
): Decoration[] =>
  cells.map(cell => {
    const classes = [ClassName.HOVERED_CELL];
    if (danger) {
      classes.push(ClassName.HOVERED_CELL_IN_DANGER);
    }

    classes.push(
      type === 'column'
        ? ClassName.HOVERED_COLUMN
        : type === 'row'
        ? ClassName.HOVERED_ROW
        : ClassName.HOVERED_TABLE,
    );

    let key: TableDecorations;
    switch (type) {
      case 'row':
        key = TableDecorations.ROW_CONTROLS_HOVER;
        break;

      case 'column':
        key = TableDecorations.COLUMN_CONTROLS_HOVER;
        break;

      default:
        key = TableDecorations.TABLE_CONTROLS_HOVER;
        break;
    }

    return Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: classes.join(' '),
      },
      { key },
    );
  });

export const createColumnSelectedDecorations = (
  tr: Transaction,
): Decoration[] => {
  const { selection, doc } = tr;
  const table = findTable(selection);
  const rect = getSelectionRect(selection);

  if (!table || !rect) {
    return [];
  }

  const map = TableMap.get(table.node);
  const cellPositions = map.cellsInRect(rect);

  return cellPositions.map((pos, index) => {
    const cell = doc.nodeAt(pos + table.start);

    return Decoration.node(
      pos + table.start,
      pos + table.start + cell!.nodeSize,
      {
        class: ClassName.COLUMN_SELECTED,
      },
      {
        key: `${TableDecorations.COLUMN_SELECTED}_${index}`,
      },
    );
  });
};

export const createColumnControlsDecoration = (
  doc: PmNode,
  selection: Selection,
  allowColumnResizing?: boolean,
): Decoration[] => {
  const prevTable = findTable(selection) as NodeWithPos;
  // taking the table node from the document updated by the transaction changes
  const table = doc.nodeAt(prevTable.pos) as PmNode;
  const cells: NodeWithPos[] = [];
  (table.content.firstChild as PmNode).descendants((child, pos) => {
    cells.push({ node: child, pos: pos + prevTable.pos + 2 });
    return false;
  });
  let index = 0;
  const cellsCount = cells.length;
  return cells.map((cell, colIndex) => {
    const attrs = cell.node.attrs as CellAttributes;
    const colspan = attrs.colspan || 1;
    const element = document.createElement('div');
    element.classList.add(ClassName.COLUMN_CONTROLS_DECORATIONS);
    const startIndex = index;
    element.dataset.startIndex = `${index}`;
    index += colspan;
    element.dataset.endIndex = `${index}`;

    if (allowColumnResizing) {
      let start = 0;
      // looping through colspans and creating resize handle node for each
      Array.from(Array(colspan).keys()).forEach(colSpanIndex => {
        const node = createResizeHandleNode(
          startIndex + colSpanIndex,
          colSpanIndex,
        );
        const colWidth = (attrs.colwidth || [])[colSpanIndex];

        // last resize handle in the table (we don't want it to go beyond the table width)
        if (colIndex === cellsCount - 1 && colSpanIndex === colspan - 1) {
          node.style.right = `${-tableResizeHandleWidth / 2 - 1}px`;
        } else {
          const offset = tableResizeHandleWidth / 2 + 4;
          node.style.left = colWidth
            ? // table has been resized, we position resize handles using values form colWidth attribute
              `${colWidth + start - offset}px`
            : // table hasn't been resized, we position with cell using %
              `calc(${(100 / colspan) * (colSpanIndex + 1)}% - ${offset}px)`;
        }

        start += colWidth;
        element.appendChild(node);
      });
    }

    return Decoration.widget(
      cell.pos + 1,
      // Do not delay the rendering for this Decoration
      // because we need to always render all controls
      // to keep the order safe
      element,
      {
        key: `${TableDecorations.COLUMN_CONTROLS_DECORATIONS}_${index}`,
        // this decoration should be the first one, even before gap cursor.
        side: -100,
      },
    );
  });
};

export const updateNodeDecorations = (
  node: PmNode,
  decorationSet: DecorationSet,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet => {
  const filteredDecorations = filterDecorationByKey(key, decorationSet);
  const decorationSetFiltered = decorationSet.remove(filteredDecorations);

  return decorationSetFiltered.add(node, decorations);
};

export const updatePluginStateDecorations = (
  state: EditorState<any>,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet =>
  updateNodeDecorations(
    state.doc,
    getPluginState(state).decorationSet || DecorationSet.empty,
    decorations,
    key,
  );
