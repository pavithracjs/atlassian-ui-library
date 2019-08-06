import { Plugin, PluginKey } from 'prosemirror-state';

import { PortalProviderAPI } from '../../../ui/PortalProvider';
import headingNodeView from '../nodeviews';
import { DispatchAnalyticsEvent } from '../../analytics';

export const pluginKey = new PluginKey('headingPlugin');

export function createPlugin(
  portalProviderAPI: PortalProviderAPI,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
) {
  return new Plugin({
    key: pluginKey,
    props: {
      nodeViews: {
        heading: headingNodeView(portalProviderAPI, dispatchAnalyticsEvent),
      },
    },
  });
}
