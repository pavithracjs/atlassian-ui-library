import { defineMessages } from 'react-intl';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import { Command } from '../../types';
import {
  analyticsService as analytics,
  AnalyticsProperties,
} from '../../analytics';
import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { TablePluginState } from './types';
import { pluginKey } from './pm-plugins/main';
import {
  pluginKey as tableResizingPluginKey,
  ResizeState,
} from './pm-plugins/table-resizing/index';
import { hoverTable, deleteTable, clearHoverSelection } from './actions';

export const messages = defineMessages({
  tableOptions: {
    id: 'fabric.editor.tableOptions',
    defaultMessage: 'Table options',
    description: 'Opens a menu with additional table options',
  },
  headerRow: {
    id: 'fabric.editor.headerRow',
    defaultMessage: 'Header row',
    description: 'Marks the first table row as a header row',
  },
  headerColumn: {
    id: 'fabric.editor.headerColumn',
    defaultMessage: 'Header column',
    description: 'Marks the first table column as a header row',
  },
  numberedColumn: {
    id: 'fabric.editor.numberedColumn',
    defaultMessage: 'Numbered column',
    description: 'Adds an auto-numbering column to your table',
  },
});

const withAnalytics = (
  command: Command,
  eventName: string,
  properties?: AnalyticsProperties,
): Command => (state, dispatch) => {
  analytics.trackEvent(eventName, properties);
  return command(state, dispatch);
};

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const tableState: TablePluginState | undefined = pluginKey.getState(state);
  const resizeState: ResizeState | undefined = tableResizingPluginKey.getState(
    state,
  );
  if (
    tableState &&
    tableState.tableRef &&
    tableState.tableNode &&
    tableState.pluginConfig
  ) {
    return {
      title: 'Table floating controls',
      getDomRef: () => tableState.tableFloatingToolbarTarget!,
      nodeType: state.schema.nodes.table,
      items: [
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteTable,
          disabled: !!resizeState && !!resizeState.dragging,
          onMouseEnter: hoverTable(true),
          onMouseLeave: clearHoverSelection,
          title: formatMessage(commonMessages.remove),
        },
      ],
    };
  }
};
