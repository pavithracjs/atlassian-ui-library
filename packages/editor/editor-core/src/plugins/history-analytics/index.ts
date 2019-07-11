import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';

const historyAnalyticsPlugin: EditorPlugin = {
  name: 'historyAnalyticsPlugin',
  pmPlugins() {
    return [
      {
        name: 'historyAnalytics',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
      {
        name: 'historyAnalyticsKeymap',
        plugin: () => keymapPlugin(),
      },
    ];
  },
};

export default historyAnalyticsPlugin;
