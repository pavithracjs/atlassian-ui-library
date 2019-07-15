import { keymap } from 'prosemirror-keymap';
import { Plugin, EditorState } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import * as commands from './commands';
import { CommandDispatch } from 'src/types';

export default function keymapPlugin(): Plugin {
  const bindings = {};
  keymaps.bindKeymapWithCommand(
    keymaps.undo.common!,
    (state: EditorState, dispatch?: CommandDispatch) => {
      commands.undo(state, dispatch);
      return false;
    },
    bindings,
  );
  return keymap(bindings);
}
