import * as React from 'react';
import { panel, PanelType } from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import { messages } from '../block-type/types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

import keymap from './pm-plugins/keymaps';
import { EditorState } from 'prosemirror-state';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
  PANEL_TYPE,
} from '../analytics';
import { QuickInsertActionInsert } from '../quick-insert/types';
import {
  IconPanel,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconPanelError,
} from '../../assets/quick-insert';

const insertPanelTypeWithAnalytics = (
  panelType: PANEL_TYPE,
  state: EditorState,
  insert: QuickInsertActionInsert,
) => {
  const tr = insert(insertPanelType(panelType, state));
  if (tr) {
    addAnalytics(tr, {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.PANEL,
      attributes: {
        inputMethod: INPUT_METHOD.QUICK_INSERT,
        panelType,
      },
      eventType: EVENT_TYPE.TRACK,
    });
  }
  return tr;
};

const insertPanelType = (panelType: PanelType, state: EditorState) =>
  state.schema.nodes.panel.createChecked(
    { panelType },
    state.schema.nodes.paragraph.createChecked(),
  );

const panelPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [
      { name: 'panel', plugin: createPlugin },
      {
        name: 'panelKeyMap',
        plugin: () => keymap(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.panel),
        description: formatMessage(messages.panelDescription),
        keywords: ['info'],
        priority: 900,
        icon: () => <IconPanel />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.INFO, state, insert);
        },
      },
      {
        title: formatMessage(messages.notePanel),
        description: formatMessage(messages.notePanelDescription),
        keywords: ['note'],
        priority: 1000,
        icon: () => <IconPanelNote />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.NOTE, state, insert);
        },
      },
      {
        title: formatMessage(messages.successPanel),
        description: formatMessage(messages.successPanelDescription),
        keywords: ['success', 'tip'],
        priority: 1000,
        icon: () => <IconPanelSuccess />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(
            PANEL_TYPE.SUCCESS,
            state,
            insert,
          );
        },
      },
      {
        title: formatMessage(messages.warningPanel),
        description: formatMessage(messages.warningPanelDescription),
        keywords: ['warning'],
        priority: 1000,
        icon: () => <IconPanelWarning />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(
            PANEL_TYPE.WARNING,
            state,
            insert,
          );
        },
      },
      {
        title: formatMessage(messages.errorPanel),
        description: formatMessage(messages.errorPanelDescription),
        keywords: ['error'],
        priority: 1000,
        icon: () => <IconPanelError />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.ERROR, state, insert);
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
};

export default panelPlugin;
