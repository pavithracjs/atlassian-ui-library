import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { arrow, deleteNode } from '../actions';
import { Direction } from '../direction';
import { Command } from '../../../types';
import { setTextSelection } from 'prosemirror-utils';
import { GapCursorSelection } from '../selection';

const enterKeyCommand: Command = (state, dispatch): boolean => {
  const { listItem, paragraph, bulletList, orderedList } = state.schema.nodes;
  const { $to, $from } = state.selection;
  if (state.selection instanceof GapCursorSelection) {
    const wrapper = $from.node($from.depth - 1);
    // Only create a new list item if we're inside a list
    if (
      (wrapper && wrapper.type === bulletList) ||
      wrapper.type === orderedList
    ) {
      const tr = state.tr.insert(
        $to.pos + 1,
        listItem.createChecked({}, paragraph.createChecked()),
      );
      if (dispatch) {
        dispatch(setTextSelection($to.pos + 3)(tr));
      }
      return true;
    }
  }
  return false;
};

export default function keymapPlugin(): Plugin {
  const map = {};

  keymaps.bindKeymapWithCommand(keymaps.enter.common!, enterKeyCommand, map);

  keymaps.bindKeymapWithCommand(
    keymaps.moveLeft.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.LEFT, endOfTextblock)(state, dispatch);
    },
    map,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveRight.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.RIGHT, endOfTextblock)(state, dispatch);
    },
    map,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.UP, endOfTextblock)(state, dispatch);
    },
    map,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.DOWN, endOfTextblock)(state, dispatch);
    },
    map,
  );

  // default PM's Backspace doesn't handle removing block nodes when cursor is after it
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    deleteNode(Direction.BACKWARD),
    map,
  );

  // handle Delete key (remove node after the cursor)
  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!,
    deleteNode(Direction.FORWARD),
    map,
  );

  return keymap(map);
}
