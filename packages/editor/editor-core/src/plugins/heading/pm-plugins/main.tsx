import React from 'react';
import ReactDOM from 'react-dom';
import { Plugin, PluginKey } from 'prosemirror-state';

import { DecorationSet, Decoration } from 'prosemirror-view';
import { flatten } from 'prosemirror-utils';
import { HeadingAnchorWrapperClassName } from '@atlaskit/editor-common/src/ui/heading-anchor';
import EditorHeadingAnchor from '../ui/editor-heading-anchor';

import { DispatchAnalyticsEvent } from '../../analytics';

export const pluginKey = new PluginKey('headingPlugin');

export function createPlugin(
  copyHeadingAnchorLink: (textToCopy: string) => Promise<void>,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  reactContext: () => { [key: string]: any },
) {
  const HeadingAnchorPlugin: Plugin = new Plugin({
    key: pluginKey,
    props: {
      decorations(state) {
        const headingNodes = flatten(state.doc, false).filter(({ node }) => {
          return node.type.name === state.doc.type.schema.nodes.heading.name;
        });

        const { intl } = reactContext();

        if (headingNodes.length > 0) {
          let headingIds: Array<String> = [];
          const decorations = headingNodes.map(item => {
            const headingId = item.node.textContent.replace(/ /g, '-').trim();
            const count = headingIds.filter(id => id === headingId).length;
            const nodeHeadingId = count ? `${headingId}.${count}` : headingId;
            headingIds.push(headingId);
            const anchorNode = document.createElement('div');
            anchorNode.classList.add(HeadingAnchorWrapperClassName);
            anchorNode.id = nodeHeadingId;
            if (headingId) {
              ReactDOM.render(
                <EditorHeadingAnchor
                  locale={intl.locale}
                  onClick={() => copyHeadingAnchorLink(nodeHeadingId)}
                  dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                />,
                anchorNode,
              );
            }

            return Decoration.widget(item.pos + 1, anchorNode, {
              raw: true,
              key: 'anchor-name',
            } as any);
          });

          return DecorationSet.create(state.doc, decorations);
        } else {
          return DecorationSet.empty;
        }
      },
    },
  });

  return HeadingAnchorPlugin;
}
