import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import * as commands from './commands';

export default function keymapPlugin(): Plugin {
  const bindings = {};
  keymaps.bindKeymapWithCommand(keymaps.undo.common!, commands.undo, bindings);
  return keymap(bindings);
}
