import { Node as PMNode } from 'prosemirror-model';
import {
  tableCellMinWidth,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';
import { getTableWidth } from '../../../utils';
import { DomAtPos } from '../../../../../types';
import {
  getLayoutSize,
  ResizeState,
  getResizeStateFromDOM,
  getTotalWidth,
  reduceSpace,
} from '../utils';

export interface ScaleOptions {
  node: PMNode;
  prevNode: PMNode;
  start: number;
  containerWidth?: number;
  previousContainerWidth?: number;
  parentWidth?: number;
  dynamicTextSizing?: boolean;
  isBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
}

// Base function to trigger the actual scale on a table node.
// Will only resize/scale if a table has been previously resized.
export const scale = (
  tableRef: HTMLTableElement,
  options: ScaleOptions,
  domAtPos: DomAtPos,
): ResizeState | undefined => {
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
    start,
    isBreakoutEnabled,
  } = options;

  const maxSize = getLayoutSize(node.attrs.layout, containerWidth, {
    dynamicTextSizing,
    isBreakoutEnabled,
  });
  const prevTableWidth = getTableWidth(prevNode);
  const previousMaxSize = getLayoutSize(
    prevNode.attrs.layout,
    previousContainerWidth,
    {
      dynamicTextSizing,
      isBreakoutEnabled,
    },
  );

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
    domAtPos,
  });

  return scaleTableTo(resizeState, newWidth);
};

export const scaleWithParent = (
  tableRef: HTMLTableElement,
  parentWidth: number,
  table: PMNode,
  start: number,
  domAtPos: DomAtPos,
) => {
  const resizeState = getResizeStateFromDOM({
    minWidth: tableCellMinWidth,
    maxSize: parentWidth,
    table,
    tableRef,
    start,
    domAtPos,
  });

  if (table.attrs.isNumberColumnEnabled) {
    parentWidth -= akEditorTableNumberColumnWidth;
  }

  return scaleTableTo(resizeState, Math.floor(parentWidth));
};

// Scales the table to a given size and updates its colgroup DOM node
function scaleTableTo(state: ResizeState, newWidth: number): ResizeState {
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

  return newState;
}
