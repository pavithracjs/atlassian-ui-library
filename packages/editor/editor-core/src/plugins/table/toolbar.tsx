import * as React from 'react';
import { defineMessages } from 'react-intl';
import Icon from '@atlaskit/icon';
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
import {
  hoverTable,
  deleteTable,
  clearHoverSelection,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
} from './actions';
import {
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
} from './utils';

const HeaderRowIcon = () => (
  <div style={{ width: 24 }}>
    <Icon
      size="small"
      glyph={() => (
        <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              transform="translate(-406.000000, -499.000000)"
              fill="currentColor"
            >
              <path d="M408,499 L418,499 C419.104569,499 420,499.895431 420,501 L420,511 C420,512.104569 419.104569,513 418,513 L408,513 C406.895431,513 406,512.104569 406,511 L406,501 C406,499.895431 406.895431,499 408,499 Z M408,505 L408,507.25 L412,507.25 L412,505 L408,505 Z M414,505 L414,507.25 L418,507.25 L418,505 L414,505 Z M408,508.75 L408,511 L412,511 L412,508.75 L408,508.75 Z M414,508.75 L414,511 L418,511 L418,508.75 L414,508.75 Z" />
            </g>
          </g>
        </svg>
      )}
    />
  </div>
);

const HeaderColumnIcon = () => (
  <div style={{ width: 24 }}>
    <Icon
      size="small"
      glyph={() => (
        <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              transform="translate(-433.000000, -496.000000)"
              fill="currentColor"
            >
              <path d="M435,496 L445,496 C446.104569,496 447,496.895431 447,498 L447,508 C447,509.104569 446.104569,510 445,510 L435,510 C433.895431,510 433,509.104569 433,508 L433,498 C433,496.895431 433.895431,496 435,496 Z M445,498 L442.75,498 L442.75,502 L445,502 L445,498 Z M445,504 L442.75,504 L442.75,508 L445,508 L445,504 Z M441.25,498 L439,498 L439,502 L441.25,502 L441.25,498 Z M441.25,504 L439,504 L439,508 L441.25,508 L441.25,504 Z" />
            </g>
          </g>
        </svg>
      )}
    />
  </div>
);

const NumberColumnIcon = () => (
  <div style={{ width: 24 }}>
    <Icon
      size="small"
      glyph={() => (
        <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              transform="translate(-453.000000, -522.000000)"
              fill="currentColor"
            >
              <path d="M455,522 L465,522 C466.104569,522 467,522.895431 467,524 L467,534 C467,535.104569 466.104569,536 465,536 L455,536 C453.895431,536 453,535.104569 453,534 L453,524 C453,522.895431 453.895431,522 455,522 Z M456.1,531.4 C456.1,531.7318 456.3688,532 456.7,532 C457.0312,532 457.3,531.7318 457.3,531.4 L457.3,526.6 C457.3,526.2682 457.0312,526 456.7,526 L455.8,526 C455.4688,526 455.2,526.2682 455.2,526.6 C455.2,526.9312 455.4688,527.2 455.8,527.2 L456.1,527.2 L456.1,531.4 Z M463.6,532 C464.2618,532 464.8,531.4618 464.8,530.8 L464.8,529.6 C464.8,529.3816 464.7412,529.1764 464.6386,529 C464.7412,528.823 464.8,528.6184 464.8,528.4 L464.8,527.2 C464.8,526.5376 464.2618,526 463.6,526 L462.4,526 C462.0682,526 461.8,526.2682 461.8,526.6 C461.8,526.9312 462.0682,527.2 462.4,527.2 L463.6,527.2 L463.6,528.4 L463,528.4 C462.6682,528.4 462.4,528.6682 462.4,529 C462.4,529.3312 462.6682,529.5994 463,529.5994 L463.6,529.6 L463.6,530.8 L462.4,530.8 C462.0682,530.8 461.8,531.0682 461.8,531.4 C461.8,531.7318 462.0682,532 462.4,532 L463.6,532 Z M460.6,532 C460.9318,532 461.2,531.7318 461.2,531.4 C461.2,531.0682 460.9318,530.8 460.6,530.8 L459.4,530.8 L459.4,529.5994 L460,529.5994 C460.6618,529.5994 461.2,529.0618 461.2,528.4 L461.2,527.2 C461.2,526.5376 460.6618,526 460,526 L458.8,526 C458.4688,526 458.2,526.2682 458.2,526.6 C458.2,526.9312 458.4688,527.2 458.8,527.2 L460,527.2 L460,528.4 L459.4,528.4 C458.7382,528.4 458.2,528.9382 458.2,529.6 L458.2,531.4 C458.2,531.7318 458.4688,532 458.8,532 L460.6,532 Z" />
            </g>
          </g>
        </svg>
      )}
    />
  </div>
);

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
    const { pluginConfig } = tableState;
    return {
      title: 'Table floating controls',
      getDomRef: () => tableState.tableFloatingToolbarTarget!,
      nodeType: state.schema.nodes.table,
      items: [
        {
          type: 'button',
          icon: HeaderRowIcon,
          onClick: withAnalytics(
            toggleHeaderRow,
            'atlassian.editor.format.table.toggleHeaderRow.button',
          ),
          selected: checkIfHeaderRowEnabled(state),
          hidden: !pluginConfig.allowHeaderRow,
          title: formatMessage(messages.headerRow),
        },
        {
          type: 'button',
          icon: HeaderColumnIcon,
          title: formatMessage(messages.headerColumn),
          onClick: withAnalytics(
            toggleHeaderColumn,
            'atlassian.editor.format.table.toggleHeaderColumn.button',
          ),
          selected: checkIfHeaderColumnEnabled(state),
          hidden: !pluginConfig.allowHeaderColumn,
        },
        {
          type: 'button',
          icon: NumberColumnIcon,
          title: formatMessage(messages.numberedColumn),
          selected: checkIfNumberColumnEnabled(state),
          onClick: withAnalytics(
            toggleNumberColumn,
            'atlassian.editor.format.table.toggleNumberColumn.button',
          ),
          hidden: !pluginConfig.allowNumberColumn,
        },
        {
          type: 'separator',
          hidden: !(
            pluginConfig.allowBackgroundColor &&
            pluginConfig.allowHeaderRow &&
            pluginConfig.allowHeaderColumn &&
            pluginConfig.allowMergeCells
          ),
        },
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
