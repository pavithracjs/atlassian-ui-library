import { createCommand, getPluginState } from './main';
import { analyticsPluginKey } from '../../analytics/plugin';

export const undo = createCommand(state => {
  console.log('undo');
  const pluginState = getPluginState(state);
  console.log(pluginState);
  // pop x transactions off stack
  const tr = pluginState.done.pop();
  if (tr.getMeta(analyticsPluginKey)) {
    console.log(tr.getMeta(analyticsPluginKey));
  }

  // inspect for analytics meta

  // dispatch new undo analytics event(s)

  return true;
});
