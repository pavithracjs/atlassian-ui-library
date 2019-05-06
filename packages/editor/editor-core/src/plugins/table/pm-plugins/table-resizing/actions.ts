import { TableMap } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  tableCellMinWidth,
  akEditorTableNumberColumnWidth,
  akEditorTableToolbarSize,
} from '@atlaskit/editor-common';

import { TableCssClassName as ClassName } from '../../types';
import { pluginKey as resizePluginKey } from './plugin';
import { getPluginState } from '../main';
import { updateRightShadow } from '../../nodeviews/TableComponent';

import { getTableWidth, getColumnsWidths } from '../../utils';
import { closestElement } from '../../../../utils';
import {
  getLayoutSize,
  getDefaultLayoutMaxWidth,
  tableLayoutToSize,
  addContainerLeftRightPadding,
  ResizeState,
  resizeColumn,
  getResizeStateFromDOM,
  scaleTable as scaleTableUtil,
  hasTableBeenResized,
  insertColgroupFromNode as recreateResizeColsByNode,
} from './utils';

export interface ScaleOptions {
  node: PMNode;
  prevNode: PMNode;
  start: number;
  containerWidth?: number;
  previousContainerWidth?: number;
  initialScale?: boolean;
  parentWidth?: number;
  dynamicTextSizing?: boolean;
  isBreakoutEnabled?: boolean;
  wasBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
}

export function updateColumnWidth(
  view: EditorView,
  cell: number,
  amount: number,
  state: ResizeState,
) {
  let $cell = view.state.doc.resolve(cell);
  let table = $cell.node(-1);
  let map = TableMap.get(table);
  let start = $cell.start(-1);
  let colIndex =
    map.colCount($cell.pos - start) +
    ($cell.nodeAfter ? $cell.nodeAfter.attrs.colspan : 1) -
    1;

  const newState = resizeColumn(state, colIndex, amount);
  const tr = applyColumnWidths(view, newState, table, start);

  if (tr.docChanged) {
    view.dispatch(tr);
  }
}

export function applyColumnWidths(
  view: EditorView,
  state: ResizeState,
  table: PMNode,
  start: number,
) {
  let tr = view.state.tr;
  let map = TableMap.get(table);

  for (let i = 0; i < state.cols.length; i++) {
    const width = state.cols[i].width;
    // we need to recalculate table node to pick up attributes from the previous loop iteration
    table = tr.doc.nodeAt(start - 1)!;

    for (let row = 0; row < map.height; row++) {
      let mapIndex = row * map.width + i;
      // Rowspanning cell that has already been handled
      if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) {
        continue;
      }
      let pos = map.map[mapIndex];
      let { attrs } = table.nodeAt(pos) || { attrs: {} };
      let index = attrs.colspan === 1 ? 0 : i - map.colCount(pos);

      if (attrs.colwidth && attrs.colwidth[index] === width) {
        continue;
      }

      let colwidth = attrs.colwidth
        ? attrs.colwidth.slice()
        : Array.from({ length: attrs.colspan }, _ => 0);

      colwidth[index] = width;
      tr = tr.setNodeMarkup(start + pos, undefined, { ...attrs, colwidth });
    }
  }
  return tr;
}

export function handleBreakoutContent(
  view: EditorView,
  elem: HTMLTableElement,
  cellPos: number,
  start: number,
  minWidth: number,
  node: PMNode,
) {
  const map = TableMap.get(node);
  const rect = map.findCell(cellPos - start);
  const colIdx = rect.left;

  const cellStyle = getComputedStyle(elem);
  const amount = addContainerLeftRightPadding(
    minWidth - elem.offsetWidth,
    cellStyle,
  );

  const state = resizeColumnTo(view, start, elem, colIdx, amount, node);
  updateControls(view.state, view.domAtPos.bind(view));
  const tr = applyColumnWidths(view, state, node, start);

  if (tr.docChanged) {
    view.dispatch(tr);
  }
}

export const updateResizeHandle = (view: EditorView) => {
  const { state } = view;
  const { activeHandle } = resizePluginKey.getState(state);
  if (activeHandle === -1) {
    return false;
  }

  const $cell = view.state.doc.resolve(activeHandle);
  const tablePos = $cell.start(-1) - 1;
  const tableWrapperRef = findDomRefAtPos(
    tablePos,
    view.domAtPos.bind(view),
  ) as HTMLDivElement;

  const resizeHandleRef = tableWrapperRef.querySelector(
    `.${ClassName.COLUMN_RESIZE_HANDLE}`,
  ) as HTMLDivElement;

  const tableRef = tableWrapperRef.querySelector(`table`) as HTMLTableElement;

  if (tableRef && resizeHandleRef) {
    const cellRef = findDomRefAtPos(
      activeHandle,
      view.domAtPos.bind(view),
    ) as HTMLTableCellElement;
    const tableActive = closestElement(tableRef, `.${ClassName.WITH_CONTROLS}`);
    resizeHandleRef.style.height = `${
      tableActive
        ? tableRef.offsetHeight + akEditorTableToolbarSize
        : tableRef.offsetHeight
    }px`;

    resizeHandleRef.style.left = `${cellRef.offsetLeft +
      cellRef.offsetWidth}px`;
  }
};

/**
 * Updates the column controls on resize
 */
export const updateControls = (
  state: EditorState,
  domAtPos: (pos: number) => { node: Node; offset: number },
) => {
  const { tableRef } = getPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const wrapper = tableRef.parentElement;
  const columnControls: any = wrapper.querySelectorAll(
    `.${ClassName.COLUMN_CONTROLS_BUTTON_WRAP}`,
  );
  const rows = tableRef.querySelectorAll('tr');
  const rowControls: any = wrapper.parentElement.querySelectorAll(
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`,
  );
  const numberedRows = wrapper.parentElement.querySelectorAll(
    ClassName.NUMBERED_COLUMN_BUTTON,
  );

  const getHeight = (element: HTMLElement): number => {
    const rect = element.getBoundingClientRect();
    return rect ? rect.height : element.offsetHeight;
  };

  const columnsWidths = getColumnsWidths(state, domAtPos);
  // update column controls width on resize
  for (let i = 0, count = columnControls.length; i < count; i++) {
    if (columnsWidths[i]) {
      columnControls[i].style.width = `${columnsWidths[i]}px`;
    }
  }
  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    if (rows[i]) {
      rowControls[i].style.height = `${getHeight(rows[i]) + 1}px`;

      if (numberedRows.length) {
        numberedRows[i].style.height = `${getHeight(rows[i]) + 1}px`;
      }
    }
  }

  updateRightShadow(
    wrapper,
    tableRef,
    wrapper.parentElement.querySelector(`.${ClassName.TABLE_RIGHT_SHADOW}`),
  );
};

// Scale the table to meet new requirements (col, layout change etc)
export function scaleTable(
  view: EditorView,
  tableElem: HTMLTableElement | null | undefined,
  options: ScaleOptions,
) {
  if (!tableElem) {
    return;
  }

  const { node, start, parentWidth } = options;

  // If a table has not been resized yet, columns should be auto.
  if (hasTableBeenResized(node) === false) {
    // If its not a re-sized table, we still want to re-create cols
    // To force reflow of columns upon delete.
    recreateResizeColsByNode(tableElem, node);
    return;
  }

  let state;
  if (parentWidth) {
    state = scaleWithParent(view, tableElem, parentWidth, node, start);
  } else {
    state = scale(view, tableElem, {
      start,
      ...options,
    });
  }

  if (state) {
    const tr = applyColumnWidths(view, state, node, start);

    if (tr.docChanged) {
      view.dispatch(tr);
    }
  }
}

// Light wrapper over resizeColumn, Mainly used to re-set a columns width.
export function resizeColumnTo(
  view: EditorView,
  start: number,
  tableRef: HTMLTableElement,
  colIndex: number,
  amount: number,
  table: PMNode,
): ResizeState {
  while (tableRef.nodeName !== 'TABLE') {
    tableRef = tableRef.parentNode as HTMLTableElement;
  }

  const resizeState = getResizeStateFromDOM({
    minWidth: tableCellMinWidth,
    maxSize: tableRef.offsetWidth,
    table,
    tableRef,
    start,
    domAtPos: view.domAtPos.bind(view),
  });

  return resizeColumn(resizeState, colIndex, amount);
}

// Base function to trigger the actual scale on a table node.
// Will only resize/scale if a table has been previously resized.
function scale(
  view: EditorView,
  tableRef: HTMLTableElement,
  options: ScaleOptions,
): ResizeState | undefined {
  /**
   * isBreakoutEnabled === true -> default center aligned
   * isBreakoutEnabled === false -> full width mode
   */

  const {
    node,
    containerWidth,
    previousContainerWidth,
    dynamicTextSizing,
    prevNode,
    initialScale,
    start,
    isBreakoutEnabled,
    wasBreakoutEnabled,
  } = options;

  let maxSize = getLayoutSize(node.attrs.layout, containerWidth, {
    dynamicTextSizing,
    isBreakoutEnabled,
  });

  const prevTableWidth = getTableWidth(prevNode);
  const previousLayout = prevNode.attrs.layout;

  let previousMaxSize = tableLayoutToSize[previousLayout];
  if (dynamicTextSizing && previousLayout === 'default') {
    previousMaxSize = getDefaultLayoutMaxWidth(previousContainerWidth);
  }

  if (!initialScale) {
    previousMaxSize = getLayoutSize(
      prevNode.attrs.layout,
      previousContainerWidth,
      {
        dynamicTextSizing,
        isBreakoutEnabled,
      },
    );
  } else if (
    initialScale &&
    isBreakoutEnabled !== wasBreakoutEnabled &&
    typeof wasBreakoutEnabled !== 'undefined'
  ) {
    previousMaxSize = getLayoutSize(
      prevNode.attrs.layout,
      previousContainerWidth,
      {
        dynamicTextSizing: !dynamicTextSizing,
        isBreakoutEnabled: !isBreakoutEnabled,
      },
    );
  }

  let newWidth = maxSize;

  // Determine if table was overflow
  if (prevTableWidth > previousMaxSize) {
    const overflowScale = prevTableWidth / previousMaxSize;
    newWidth = Math.floor(newWidth * overflowScale);
  }

  if (node.attrs.isNumberColumnEnabled) {
    newWidth -= akEditorTableNumberColumnWidth;
  }

  const resizeState = getResizeStateFromDOM({
    minWidth: tableCellMinWidth,
    maxSize,
    table: node,
    tableRef,
    start,
    domAtPos: view.domAtPos.bind(view),
  });

  return scaleTableUtil(resizeState, newWidth);
}

function scaleWithParent(
  view: EditorView,
  tableRef: HTMLTableElement,
  parentWidth: number,
  table: PMNode,
  start: number,
) {
  const resizeState = getResizeStateFromDOM({
    minWidth: tableCellMinWidth,
    maxSize: parentWidth,
    table,
    tableRef,
    start,
    domAtPos: view.domAtPos.bind(view),
  });

  if (table.attrs.isNumberColumnEnabled) {
    parentWidth -= akEditorTableNumberColumnWidth;
  }

  return scaleTableUtil(resizeState, Math.floor(parentWidth));
}
