import * as React from 'react';
import { PresetProvider } from '../Editor';
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
} from '../../../plugins';
import { MentionProvider } from '@atlaskit/mention/resource';
import { MediaProvider } from '../../../plugins/media';

interface EditorPresetCXHTMLProps {
  children?: React.ReactNode;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
}

export function EditorPresetCXHTML({
  children,
  mentionProvider,
  mediaProvider,
}: EditorPresetCXHTMLProps) {
  const plugins = [
    pastePlugin(),
    blockTypePlugin(),
    clearMarksOnChangeToEmptyDocumentPlugin(),
    hyperlinkPlugin(),
    textFormattingPlugin({}),
    widthPlugin(),
    unsupportedContentPlugin(),
    quickInsertPlugin(),
    tablesPlugin({
      tableOptions: { advanced: true },
    }),
    codeBlockPlugin(),
    panelPlugin(),
    listsPlugin(),
    textColorPlugin(),
    breakoutPlugin(),
    jiraIssuePlugin(),
    extensionPlugin(),
    rulePlugin(),
    datePlugin(),
    layoutPlugin(),
    indentationPlugin(),
    cardPlugin(), // experimental
    statusPlugin({ menuDisabled: false }),
    tasksAndDecisionsPlugin(),
    emojiPlugin(),
    insertBlockPlugin({}),
  ];

  if (mentionProvider) {
    plugins.push(mentionsPlugin());
  }

  if (mediaProvider) {
    plugins.push(
      mediaPlugin({
        provider: mediaProvider,
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAnnotation: true,
        allowResizing: true,
      }),
    );
  }

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
