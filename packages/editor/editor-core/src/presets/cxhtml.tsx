import * as React from 'react';
import { PresetProvider } from '../lego/Editor';
import {
  pastePlugin,
  basePlugin,
  blockTypePlugin,
  placeholderPlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin,
  widthPlugin,
  typeAheadPlugin,
  unsupportedContentPlugin,
  editorDisabledPlugin,
  quickInsertPlugin,
  tablesPlugin,
  codeBlockPlugin,
  panelPlugin,
} from '../plugins';

const plugins = [
  pastePlugin,
  basePlugin,
  blockTypePlugin,
  placeholderPlugin(
    'Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.',
  ),
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin({}),
  widthPlugin,
  typeAheadPlugin,
  unsupportedContentPlugin,
  editorDisabledPlugin,
  quickInsertPlugin,
  tablesPlugin(),
  codeBlockPlugin(),
  panelPlugin,
];

export function EditorPresetCXHTML({ children }) {
  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
