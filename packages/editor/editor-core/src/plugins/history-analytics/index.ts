import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const historyAnalyticsPlugin: EditorPlugin = {
  name: 'historyAnalyticsPlugin',
  pmPlugins() {
    return [
      {
        name: 'historyAnalytics',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
    ];
  },
};

export default historyAnalyticsPlugin;
