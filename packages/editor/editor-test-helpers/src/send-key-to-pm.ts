import { browser } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { TestingEditorView } from './types/prosemirror';
import keyCodes from './key-codes';

/**
 * Sends a key to ProseMirror content area, simulating user key press.
 * Accepts key descriptions similar to Keymap, i.e. 'Shift-Ctrl-L'
 */
export default function sendKeyToPm(editorView: EditorView, keys: string) {
  const event = new CustomEvent('keydown', {
    bubbles: true,
    cancelable: true,
  });
  (event as any).DOM_KEY_LOCATION_LEFT = 1;
  (event as any).DOM_KEY_LOCATION_RIGHT = 2;

  let parts = keys.split(/-(?!'?$)/);

  // set location property of event if Left or Right version of key specified
  let location = 0;
  const locationKeyRegex = /^(Left|Right)(Ctrl|Alt|Mod|Shift|Cmd)$/;
  parts = parts.map(part => {
    if (part.search(locationKeyRegex) === -1) {
      return part;
    }
    const [, pLocation, pKey] = part.match(locationKeyRegex);
    location =
      pLocation === 'Left'
        ? (event as any).DOM_KEY_LOCATION_LEFT
        : (event as any).DOM_KEY_LOCATION_RIGHT;
    return pKey;
  });

  const modKey = parts.indexOf('Mod') !== -1;
  const cmdKey = parts.indexOf('Cmd') !== -1;
  const ctrlKey = parts.indexOf('Ctrl') !== -1;
  const shiftKey = parts.indexOf('Shift') !== -1;
  const altKey = parts.indexOf('Alt') !== -1;
  const key = parts[parts.length - 1];

  // all of the browsers are using the same keyCode for alphabetical keys
  // and it's the uppercased character code in real world
  const code = keyCodes[key] ? keyCodes[key] : key.toUpperCase().charCodeAt(0);

  (event as any).key = key.replace(/Space/g, ' ');
  (event as any).shiftKey = shiftKey;
  (event as any).altKey = altKey;
  (event as any).ctrlKey = ctrlKey || (!browser.mac && modKey);
  (event as any).metaKey = cmdKey || (browser.mac && modKey);
  (event as any).keyCode = code;
  (event as any).which = code;
  (event as any).view = window;
  (event as any).location = location;

  // try {
  (editorView as TestingEditorView).dispatchEvent(event);
  // } catch (error) {
  // throw new Error(error.message || error.name);
  // }
}
