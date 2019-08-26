import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import { heading, blockquote, hardBreak } from '@atlaskit/adf-schema';
import { EditorPlugin, AllowedBlockTypes } from '../../types';
import { ToolbarSize } from '../../ui/Toolbar';
import { createPlugin, pluginKey } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';
import ToolbarBlockType from './ui/ToolbarBlockType';
import WithPluginState from '../../ui/WithPluginState';
import { setBlockTypeWithAnalytics } from './commands';
import { messages, HeadingLevels } from './types';
import { NodeSpec } from 'prosemirror-model';
import {
  addAnalytics,
  INPUT_METHOD,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
} from '../analytics';
import * as keymaps from '../../keymaps';
import { IconQuote, IconHeading } from '../quick-insert/assets';
import {
  QuickInsertItem,
  QuickInsertActionInsert,
} from '../quick-insert/types';
import { EditorState } from 'prosemirror-state';

interface BlockTypeNode {
  name: AllowedBlockTypes;
  node: NodeSpec;
}

const headingPluginOptions = ({
  formatMessage,
}: InjectedIntl): Array<QuickInsertItem> =>
  Array.from({ length: 6 }, (_v, idx) => {
    const level = (idx + 1) as HeadingLevels;
    const descriptionDescriptor = (messages as any)[
      `heading${level}Description`
    ];
    const keyshortcut = keymaps.tooltip(
      (keymaps as any)[`toggleHeading${level}`],
    );

    return {
      title: formatMessage((messages as any)[`heading${level}`]),
      description: formatMessage(descriptionDescriptor),
      priority: 1300,
      keywords: [`h${level}`],
      keyshortcut,
      icon: () => (
        <IconHeading
          level={level}
          label={formatMessage(descriptionDescriptor)}
        />
      ),
      action(insert: QuickInsertActionInsert, state: EditorState) {
        const tr = insert(state.schema.nodes.heading.createChecked({ level }));
        return addAnalytics(tr, {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
            newHeadingLevel: level,
          },
        });
      },
    };
  });

interface BlockTypePluginOptions {
  lastNodeMustBeParagraph?: boolean;
}

const blockTypePlugin = (options?: BlockTypePluginOptions): EditorPlugin => ({
  nodes({ allowBlockType }) {
    const nodes: BlockTypeNode[] = [
      { name: 'heading', node: heading },
      { name: 'blockquote', node: blockquote },
      { name: 'hardBreak', node: hardBreak },
    ];

    if (allowBlockType) {
      const exclude = allowBlockType.exclude ? allowBlockType.exclude : [];
      return nodes.filter(node => exclude.indexOf(node.name) === -1);
    }

    return nodes;
  },

  pmPlugins() {
    return [
      {
        name: 'blockType',
        plugin: ({ dispatch }) =>
          createPlugin(dispatch, options && options.lastNodeMustBeParagraph),
      },
      {
        name: 'blockTypeInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing right/down arrow events inside tables
      {
        name: 'blockTypeKeyMap',
        plugin: ({ schema }) => keymapPlugin(schema),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
    eventDispatcher,
  }) {
    const isSmall = toolbarSize < ToolbarSize.XL;
    const boundSetBlockType = (name: string) =>
      setBlockTypeWithAnalytics(name, INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          pluginState: pluginKey,
        }}
        render={({ pluginState }) => {
          return (
            <ToolbarBlockType
              isSmall={isSmall}
              isDisabled={disabled}
              isReducedSpacing={isToolbarReducedSpacing}
              setBlockType={boundSetBlockType}
              pluginState={pluginState}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
            />
          );
        }}
      />
    );
  },

  pluginsOptions: {
    quickInsert: intl => {
      const { formatMessage } = intl;
      return [
        {
          title: formatMessage(messages.blockquote),
          description: formatMessage(messages.blockquoteDescription),
          priority: 1300,
          keyshortcut: keymaps.tooltip(keymaps.toggleBlockQuote),
          icon: () => <IconQuote label={formatMessage(messages.blockquote)} />,
          action(insert, state) {
            const tr = insert(
              state.schema.nodes.blockquote.createChecked(
                {},
                state.schema.nodes.paragraph.createChecked(),
              ),
            );

            return addAnalytics(tr, {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              eventType: EVENT_TYPE.TRACK,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT,
              },
            });
          },
        },
        ...headingPluginOptions(intl),
      ];
    },
  },
});

export default blockTypePlugin;
export { pluginKey, BlockTypeState } from './pm-plugins/main';
