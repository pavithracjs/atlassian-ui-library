import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import { akEditorTableToolbarSize } from '@atlaskit/editor-common';
import { TableCssClassName as ClassName } from '../../../types';
import { getPluginState as getMainPluginState } from '../../main';
import { getColumnsWidths } from '../../../utils';
import { closestElement } from '../../../../../utils';
import { pointsAtCell } from '../utils';
import { updateRightShadow } from '../../../nodeviews/TableComponent';
import { getPluginState } from '../plugin';

export const updateControls = (
  state: EditorState,
  domAtPos: (pos: number) => { node: Node; offset: number },
) => {
  const { tableRef } = getMainPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const wrapper = tableRef.parentElement;
  if (!(wrapper && wrapper.parentElement)) {
    return;
  }

  const columnControls = wrapper.querySelectorAll<HTMLElement>(
    `.${ClassName.COLUMN_CONTROLS_BUTTON_WRAP}`,
  );
  const rows = tableRef.querySelectorAll('tr');
  const rowControls = wrapper.parentElement.querySelectorAll<HTMLElement>(
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`,
  );
  const numberedRows = wrapper.parentElement.querySelectorAll<HTMLElement>(
    ClassName.NUMBERED_COLUMN_BUTTON,
  );

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
    wrapper.parentElement.querySelector<HTMLElement>(
      `.${ClassName.TABLE_RIGHT_SHADOW}`,
    ),
  );
};

export const isClickNear = (
  event: MouseEvent,
  click: { x: number; y: number },
): boolean => {
  const dx = click.x - event.clientX,
    dy = click.y - event.clientY;
  return dx * dx + dy * dy < 100;
};

export const createResizeHandle = (
  tableRef: HTMLTableElement,
): HTMLDivElement | null => {
  const resizeHandleRef = document.createElement('div');
  resizeHandleRef.className = ClassName.COLUMN_RESIZE_HANDLE;
  tableRef.parentNode!.appendChild(resizeHandleRef);

  const tableActive = closestElement(tableRef, `.${ClassName.WITH_CONTROLS}`);
  const style = {
    height: `${
      tableActive
        ? tableRef.offsetHeight + akEditorTableToolbarSize
        : tableRef.offsetHeight
    }px`,
    top: `${
      tableActive
        ? tableRef.offsetTop - akEditorTableToolbarSize
        : tableRef.offsetTop
    }px`,
  };

  resizeHandleRef.style.top = style.top;
  resizeHandleRef.style.height = style.height;

  return resizeHandleRef;
};

export const updateResizeHandle = (
  state: EditorState,
  domAtPos: (pos: number) => { node: Node; offset: number },
) => {
  const { resizeHandlePos } = getPluginState(state);
  if (
    resizeHandlePos === null ||
    !pointsAtCell(state.doc.resolve(resizeHandlePos))
  ) {
    return false;
  }

  const $cell = state.doc.resolve(resizeHandlePos);
  const tablePos = $cell.start(-1) - 1;
  const tableWrapperRef = findDomRefAtPos(tablePos, domAtPos) as HTMLDivElement;

  const resizeHandleRef = tableWrapperRef.querySelector(
    `.${ClassName.COLUMN_RESIZE_HANDLE}`,
  ) as HTMLDivElement;

  const tableRef = tableWrapperRef.querySelector(`table`) as HTMLTableElement;

  if (tableRef && resizeHandleRef) {
    const cellRef = findDomRefAtPos(
      resizeHandlePos,
      domAtPos,
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
  return;
};

function getHeight(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  return rect ? rect.height : element.offsetHeight;
}
