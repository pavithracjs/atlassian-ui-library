import * as React from 'react';
import { textColor } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import {
  pluginKey as textColorPluginKey,
  createPlugin,
  TextColorPluginConfig,
  TextColorPluginState,
} from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';

const pluginConfig = (
  textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

const textColorPlugin = (): EditorPlugin => ({
  name: 'textColor',

  marks() {
    return [{ name: 'textColor', mark: textColor }];
  },

  pmPlugins() {
    return [
      {
        name: 'textColor',
        plugin: ({ dispatch }) => createPlugin(dispatch, pluginConfig()),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    isToolbarReducedSpacing,
  }) {
    return (
      <WithPluginState
        plugins={{
          textColor: textColorPluginKey,
        }}
        render={({ textColor }) => (
          <ToolbarTextColor
            pluginState={textColor}
            isReducedSpacing={isToolbarReducedSpacing}
            editorView={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
          />
        )}
      />
    );
  },
});

export { TextColorPluginState, textColorPluginKey };
export default textColorPlugin;
