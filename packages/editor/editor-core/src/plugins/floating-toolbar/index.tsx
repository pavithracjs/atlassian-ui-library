import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey, Selection } from 'prosemirror-state';
import { findDomRefAtPos, findSelectedNodeOfType } from 'prosemirror-utils';
import { Popup, ProviderFactory } from '@atlaskit/editor-common';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { ToolbarLoader } from './ui/ToolbarLoader';
import { FloatingToolbarHandler, FloatingToolbarConfig } from './types';

import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../editor-disabled';

export const getRelevantConfig = (
  selection: Selection<any>,
  configs: Array<FloatingToolbarConfig>,
): FloatingToolbarConfig | undefined => {
  // node selections always take precedence, see if
  const selectedConfig = configs.find(
    config => !!findSelectedNodeOfType(config.nodeType)(selection),
  );

  if (selectedConfig) {
    return selectedConfig;
  }

  // create mapping of node type name to configs
  const configByNodeType: Record<string, FloatingToolbarConfig> = {};
  configs.forEach(config => {
    if (Array.isArray(config.nodeType)) {
      config.nodeType.forEach(nodeType => {
        configByNodeType[nodeType.name] = config;
      });
    } else {
      configByNodeType[config.nodeType.name] = config;
    }
  });

  // search up the tree from selection
  const { $from } = selection;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);

    const matchedConfig = configByNodeType[node.type.name];
    if (matchedConfig) {
      return matchedConfig;
    }
  }

  return;
};

const getDomRefFromSelection = (view: EditorView) =>
  findDomRefAtPos(
    view.state.selection.from,
    view.domAtPos.bind(view),
  ) as HTMLElement;

const floatingToolbarPlugin: EditorPlugin = {
  name: 'floatingToolbar',

  pmPlugins(floatingToolbarHandlers: Array<FloatingToolbarHandler> = []) {
    return [
      {
        // Should be after all toolbar plugins
        name: 'floatingToolbar',
        plugin: ({ dispatch, reactContext, providerFactory }) =>
          floatingToolbarPluginFactory({
            dispatch,
            floatingToolbarHandlers,
            reactContext,
            providerFactory,
          }),
      },
    ];
  },

  contentComponent({
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    editorView,
    providerFactory,
    dispatchAnalyticsEvent,
  }) {
    return (
      <WithPluginState
        plugins={{
          floatingToolbarConfig: pluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
        }}
        render={({
          editorDisabledPlugin,
          floatingToolbarConfig,
        }: {
          floatingToolbarConfig?: FloatingToolbarConfig;
          editorDisabledPlugin: EditorDisabledPluginState;
        }) => {
          if (floatingToolbarConfig) {
            const {
              title,
              getDomRef = getDomRefFromSelection,
              items,
              align = 'center',
              className = '',
              height,
              width,
            } = floatingToolbarConfig;
            const targetRef = getDomRef(editorView);

            if (targetRef && !(editorDisabledPlugin || {}).editorDisabled) {
              return (
                <Popup
                  ariaLabel={title}
                  offset={[0, 12]}
                  target={targetRef}
                  alignY="bottom"
                  fitHeight={height}
                  fitWidth={width}
                  alignX={align}
                  stick={true}
                  mountTo={popupsMountPoint}
                  boundariesElement={popupsBoundariesElement}
                  scrollableElement={popupsScrollableElement}
                >
                  <ToolbarLoader
                    items={items}
                    dispatchCommand={fn =>
                      fn && fn(editorView.state, editorView.dispatch)
                    }
                    editorView={editorView}
                    className={className}
                    focusEditor={() => editorView.focus()}
                    providerFactory={providerFactory}
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                    popupsScrollableElement={popupsScrollableElement}
                    dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                  />
                </Popup>
              );
            }
          }
          return null;
        }}
      />
    );
  },
};

export default floatingToolbarPlugin;

/**
 *
 * ProseMirror Plugin
 *
 */

export const pluginKey = new PluginKey('floatingToolbarPluginKey');

/**
 * Clean up floating toolbar configs from undesired properties.
 */
function sanitizeFloatingToolbarConfig(
  config?: FloatingToolbarConfig,
): FloatingToolbarConfig | undefined {
  if (!config) {
    return config;
  }

  const sanitizeConfig: FloatingToolbarConfig = {
    ...config,
  };

  // Cleanup from non existing node types
  if (Array.isArray(config.nodeType)) {
    // TODO: Should I remove the configuration if no nodeType?
    sanitizeConfig.nodeType = config.nodeType.filter(nodeType => !!nodeType); // Keep only valid nodeTypes
  }

  return sanitizeConfig;
}

function floatingToolbarPluginFactory(options: {
  floatingToolbarHandlers: Array<FloatingToolbarHandler>;
  dispatch: Dispatch<FloatingToolbarConfig | undefined>;
  reactContext: () => { [key: string]: any };
  providerFactory: ProviderFactory;
}) {
  const {
    floatingToolbarHandlers,
    dispatch,
    reactContext,
    providerFactory,
  } = options;
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => {
        ToolbarLoader.preload();
      },
      apply(tr, pluginState, oldState, newState) {
        const { intl } = reactContext();
        const activeConfigs = floatingToolbarHandlers
          .map(handler => handler(newState, intl, providerFactory))
          .map(config => sanitizeFloatingToolbarConfig(config)) // Clean config from bad configuration
          .filter(Boolean) as Array<FloatingToolbarConfig>;

        const relevantConfig =
          activeConfigs && getRelevantConfig(newState.selection, activeConfigs);

        dispatch(pluginKey, relevantConfig);
        return relevantConfig;
      },
    },
  });
}
