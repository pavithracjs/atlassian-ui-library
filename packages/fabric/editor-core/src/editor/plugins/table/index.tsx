import * as React from 'react';
import {
  table,
  tableCell,
  tableHeader,
  tableRow,
} from '@atlaskit/editor-common';
import { tableEditing } from 'prosemirror-tables';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/table';
import hoverSelectionPlugin from './hover-selection-plugin';
import TableFloatingControls from '../../../ui/TableFloatingControls';
import TableFloatingToolbar from '../../../ui/TableFloatingToolbar';
import ToolbarTable from './ui/ToolbarTable';

const tablesPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1700, name: 'table', node: table },
      { rank: 1800, name: 'tableHeader', node: tableHeader },
      { rank: 1900, name: 'tableRow', node: tableRow },
      { rank: 2000, name: 'tableCell', node: tableCell },
    ];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: () => plugin() },
      { rank: 910, plugin: () => tableEditing() },
      { rank: 920, plugin: () => hoverSelectionPlugin },
    ];
  },

  contentComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
  ) {
    const pluginState = stateKey.getState(editorView.state);

    return (
      <div>
        <TableFloatingControls
          editorView={editorView}
          pluginState={pluginState}
        />
        <TableFloatingToolbar
          editorView={editorView}
          pluginState={pluginState}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
        />
      </div>
    );
  },

  primaryToolbarComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    disabled,
    editorWidth,
  ) {
    const pluginState = stateKey.getState(editorView.state);
    return (
      <ToolbarTable
        isDisabled={disabled}
        editorWidth={editorWidth}
        editorView={editorView}
        pluginState={pluginState}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      />
    );
  },
};

export default tablesPlugin;
