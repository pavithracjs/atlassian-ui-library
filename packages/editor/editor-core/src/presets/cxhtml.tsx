import * as React from 'react';
import { PresetProvider } from '../lego/Editor';
import {
  pastePlugin,
  blockTypePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin,
  widthPlugin,
  unsupportedContentPlugin,
  quickInsertPlugin,
  tablesPlugin,
  codeBlockPlugin,
  panelPlugin,
  listsPlugin,
  textColorPlugin,
  breakoutPlugin,
  jiraIssuePlugin,
  extensionPlugin,
  rulePlugin,
  datePlugin,
  layoutPlugin,
  indentationPlugin,
  cardPlugin,
  statusPlugin,
  mediaPlugin,
  mentionsPlugin,
  emojiPlugin,
  tasksAndDecisionsPlugin,
  insertBlockPlugin,
} from '../plugins';

export function EditorPresetCXHTML({
  children,
  mentionProvider,
  mediaProvider,
}) {
  const plugins = [
    pastePlugin,
    blockTypePlugin,
    clearMarksOnChangeToEmptyDocumentPlugin,
    hyperlinkPlugin,
    textFormattingPlugin({}),
    widthPlugin,
    unsupportedContentPlugin,
    quickInsertPlugin,
    tablesPlugin({
      advanced: true,
    }),
    codeBlockPlugin(),
    panelPlugin,
    listsPlugin,
    textColorPlugin,
    breakoutPlugin,
    jiraIssuePlugin,
    extensionPlugin,
    rulePlugin,
    datePlugin,
    layoutPlugin,
    indentationPlugin,
    cardPlugin, // experimental
    statusPlugin({ menuDisabled: false }),
    mediaProvider &&
      mediaPlugin({
        provider: mediaProvider,
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAnnotation: true,
        allowResizing: true,
      }),
    tasksAndDecisionsPlugin,
    mentionProvider && mentionsPlugin(undefined, mentionProvider),
    insertBlockPlugin({}),
    // emojiPlugin
  ];
  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
