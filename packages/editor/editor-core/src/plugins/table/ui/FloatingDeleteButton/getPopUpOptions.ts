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
}

const DELETE_BUTTON_CONTROLS_OFFSET =
  tableToolbarSize + tableDeleteButtonSize + tableDeleteButtonOffset;

const DELETE_BUTTON_CONTROLS_NUMBERED_OFFSET =
  DELETE_BUTTON_CONTROLS_OFFSET + akEditorTableNumberColumnWidth;

function getColumnOptions(left: number): Partial<PopupProps> {
  return {
    alignX: 'left',
    alignY: 'start',
    offset: [left, DELETE_BUTTON_CONTROLS_OFFSET],
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
}: GetPopupOptions): Partial<PopupProps> {
  switch (selectionType) {
    case 'column':
      return getColumnOptions(left);
    case 'row':
      return getRowOptions(top, isNumbered);
    default: {
      return {};
    }
  }
}
