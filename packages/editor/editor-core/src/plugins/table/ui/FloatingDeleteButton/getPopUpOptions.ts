import { CellSelectionType } from './types';
import {
  PopupProps,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';
import {
  tableDeleteButtonOffset,
  tableToolbarSize,
  tableDeleteButtonSize,
} from '../styles';

interface GetPopupOptions {
  left: number;
  top: number;
  selectionType?: CellSelectionType;
  isNumbered?: boolean;
  tableWrapper: HTMLElement | null;
}

const DELETE_BUTTON_CONTROLS_OFFSET =
  tableToolbarSize + tableDeleteButtonSize + tableDeleteButtonOffset;

const DELETE_BUTTON_CONTROLS_NUMBERED_OFFSET =
  DELETE_BUTTON_CONTROLS_OFFSET + akEditorTableNumberColumnWidth;

function getColumnOptions(
  left: number,
  tableWrapper: HTMLElement | null,
): Partial<PopupProps> {
  return {
    alignX: 'left',
    alignY: 'start',
    offset: [left, DELETE_BUTTON_CONTROLS_OFFSET],
    shouldRenderPopup() {
      if (tableWrapper) {
        const rect = tableWrapper.getBoundingClientRect();
        const maxVisibleLeftPosition =
          rect.width + tableWrapper.scrollLeft - tableDeleteButtonSize;
        const minVisibleLeftPosition = tableWrapper.scrollLeft;
        return (
          maxVisibleLeftPosition - left > 0 && left > minVisibleLeftPosition
        );
      }
      return false;
    },
    onPositionCalculated(position) {
      return {
        ...position,
      };
    },
  };
}

function getRowOptions(
  top: number,
  isNumbered: boolean = false,
): Partial<PopupProps> {
  const offset = isNumbered
    ? DELETE_BUTTON_CONTROLS_NUMBERED_OFFSET
    : DELETE_BUTTON_CONTROLS_OFFSET;
  return {
    alignX: 'left',
    alignY: 'start',
    forcePlacement: true,
    offset: [-offset, -top],
  };
}

export default function getPopupOptions({
  left,
  top,
  selectionType,
  isNumbered = false,
  tableWrapper,
}: GetPopupOptions): Partial<PopupProps> {
  switch (selectionType) {
    case 'column':
      return getColumnOptions(left, tableWrapper);
    case 'row':
      return getRowOptions(top, isNumbered);
    default: {
      return {};
    }
  }
}
