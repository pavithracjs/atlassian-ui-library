import { cellAround, TableMap } from 'prosemirror-tables';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ResolvedPos, NodeSpec, Node as PMNode } from 'prosemirror-model';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { TableLayout, CellAttributes } from '@atlaskit/adf-schema';
import {
  calcTableWidth,
  akEditorWideLayoutWidth,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  getBreakpoint,
  mapBreakpointToLayoutMaxWidth,
  absoluteBreakoutWidth,
  gridMediumMaxWidth,
  akEditorGutterPadding,
} from '@atlaskit/editor-common';
import { gridSize } from '@atlaskit/theme';
import {
  LAYOUT_OFFSET,
  LAYOUT_SECTION_MARGIN,
} from '../../../../layout/styles';
import { WidthPluginState } from '../../../../width';

export const tableLayoutToSize: Record<string, number> = {
  default: akEditorDefaultLayoutWidth,
  wide: akEditorWideLayoutWidth,
  'full-width': akEditorFullWidthLayoutWidth,
};

// Translates named layouts in number values.
export function getLayoutSize(
  tableLayout: TableLayout,
  containerWidth: number = 0,
  options: {
    dynamicTextSizing?: boolean;
    isBreakoutEnabled?: boolean;
  },
): number {
  const { dynamicTextSizing, isBreakoutEnabled } = options;

  if (isBreakoutEnabled === false) {
    return containerWidth
      ? Math.min(
          containerWidth - akEditorGutterPadding * 2,
          akEditorFullWidthLayoutWidth,
        )
      : akEditorFullWidthLayoutWidth;
  }

  const calculatedTableWidth = calcTableWidth(
    tableLayout,
    containerWidth,
    true,
  );
  if (calculatedTableWidth.endsWith('px')) {
    return parseInt(calculatedTableWidth, 10);
  }

  if (dynamicTextSizing && tableLayout === 'default') {
    return getDefaultLayoutMaxWidth(containerWidth);
  }

  return tableLayoutToSize[tableLayout] || containerWidth;
}

export function getDefaultLayoutMaxWidth(containerWidth?: number): number {
  return mapBreakpointToLayoutMaxWidth(getBreakpoint(containerWidth));
}

// Does the current position point at a cell.
export function pointsAtCell($pos: ResolvedPos<any>) {
  return (
    ($pos.parent.type.spec as NodeSpec & { tableRole: string }).tableRole ===
      'row' && $pos.nodeAfter
  );
}

// Returns the pos of the cell on the side requested.
export function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: string,
  handleWidth: number,
): number {
  const buffer = side === 'right' ? -handleWidth : handleWidth; // Fixes finicky bug where posAtCoords could return wrong pos.
  let posResult = view.posAtCoords({
    left: event.clientX + buffer,
    top: event.clientY,
  });

  if (!posResult || !posResult.pos) {
    return -1;
  }

  let $cell = cellAround(view.state.doc.resolve(posResult.pos));
  if (!$cell) {
    return -1;
  }
  if (side === 'right') {
    return $cell.pos;
  }

  let map = TableMap.get($cell.node(-1));
  let start = $cell.start(-1);
  let index = map.map.indexOf($cell.pos - start);

  return index % map.width === 0 ? -1 : start + map.map[index - 1];
}

// Get the current col width, handles colspan.
export function currentColWidth(
  view: EditorView,
  cellPos: number,
  { colspan, colwidth }: CellAttributes,
): number {
  let width = colwidth && colwidth[colwidth.length - 1];
  if (width) {
    return width;
  }
  // Not fixed, read current width from DOM
  let domWidth = (view.domAtPos(cellPos + 1).node as HTMLElement).offsetWidth;
  let parts = colspan || 0;
  if (colwidth) {
    for (let i = 0; i < (colspan || 0); i++) {
      if (colwidth[i]) {
        domWidth -= colwidth[i];
        parts--;
      }
    }
  }

  return domWidth / parts;
}

// Attempts to find a parent TD/TH depending on target element.
export function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror')
      ? null
      : (target.parentNode as HTMLElement | null);
  }
  return target;
}

const getParentNode = (tablePos: number, state: EditorState): PMNode | null => {
  if (tablePos === undefined) {
    return null;
  }

  const $pos = state.doc.resolve(tablePos);
  const parent = findParentNodeOfTypeClosestToPos($pos, [
    state.schema.nodes.bodiedExtension,
    state.schema.nodes.layoutSection,
  ]);

  return parent ? parent.node : null;
};

export const getParentNodeWidth = (
  tablePos: number,
  state: EditorState,
  containerWidth: WidthPluginState,
  isFullWidthModeEnabled?: boolean,
) => {
  const node = getParentNode(tablePos, state);

  if (!node) {
    return;
  }

  let layout = node.attrs.layout || 'default';
  const { schema } = state;
  const breakoutMark =
    schema.marks.breakout && schema.marks.breakout.isInSet(node.marks);
  if (breakoutMark && breakoutMark.attrs.mode) {
    layout = breakoutMark.attrs.mode;
  }
  let parentWidth = calcBreakoutNodeWidth(
    layout,
    containerWidth,
    isFullWidthModeEnabled,
  );

  if (node.type === schema.nodes.layoutSection) {
    parentWidth += LAYOUT_OFFSET * 2; // extra width that gets added to layout

    if (containerWidth.width > gridMediumMaxWidth) {
      parentWidth -= (LAYOUT_SECTION_MARGIN + 2) * (node.childCount - 1); // margin between sections

      const $pos = state.doc.resolve(tablePos);
      const column = findParentNodeOfTypeClosestToPos($pos, [
        state.schema.nodes.layoutColumn,
      ]);
      if (column && column.node && !isNaN(column.node.attrs.width)) {
        parentWidth = Math.round(parentWidth * column.node.attrs.width * 0.01);
      }
    }
  }

  // Need to account for the padding of the parent node
  const padding =
    node.type === schema.nodes.layoutSection
      ? gridSize() * 3 // layout
      : gridSize() * 4; // bodied extension
  parentWidth -= padding;
  parentWidth -= 2; // border

  return parentWidth;
};

const calcBreakoutNodeWidth = (
  layout: 'full-width' | 'wide' | string,
  containerWidth: WidthPluginState,
  isFullWidthModeEnabled?: boolean,
) => {
  return isFullWidthModeEnabled
    ? Math.min(
        containerWidth.lineLength as number,
        akEditorFullWidthLayoutWidth,
      )
    : absoluteBreakoutWidth(layout, containerWidth.width);
};
