import { EditorState, Transaction } from 'prosemirror-state';

import { pluginKey } from './plugin';
import { Command } from '../../../../types';

export const toggleColumnDraggable = (
  columnIndex: number,
  startX: number,
  startY: number,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      setColumnDraggable: { startIndex: columnIndex, startX, startY },
    }),
  );
  return true;
};

export const toggleRowDraggable = (
  rowIndex: number,
  startX: number,
  startY: number,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      setRowDraggable: { startIndex: rowIndex, startX, startY },
    }),
  );
  return true;
};

export const clearDraggable = (): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      clearDraggable: true,
    }),
  );
  return true;
};
