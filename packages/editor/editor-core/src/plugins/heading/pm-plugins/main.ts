import { Plugin, PluginKey } from 'prosemirror-state';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import headingNodeView from '../nodeviews';
import { DispatchAnalyticsEvent } from '../../analytics';
import scrollToAnchorLink from './scroll-to-anchor';

export const pluginKey = new PluginKey('headingPlugin');

export function createPlugin(
  portalProviderAPI: PortalProviderAPI,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
) {
  return new Plugin({
    key: pluginKey,
    view: () => {
      if (window.location.hash) {
        window.setTimeout(() => {
          scrollToAnchorLink(
            window.location.hash.slice(1),
            dispatchAnalyticsEvent,
          );
        }, 0);
      }

      return {};
    },
    props: {
      nodeViews: {
        heading: headingNodeView(portalProviderAPI, dispatchAnalyticsEvent),
      },
    },
  });
}
