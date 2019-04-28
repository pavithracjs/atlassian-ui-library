import * as React from 'react';
import { defineMessages } from 'react-intl';
import { FloatingToolbarHandler, AlignType } from '../floating-toolbar/types';
import {
  stateKey,
  HyperlinkState,
  InsertState,
  EditInsertedState,
} from './pm-plugins/main';
import {
  removeLink,
  setLinkText,
  insertLink,
  editInsertedLink,
  hideLinkToolbar,
  setLinkHref,
  updateLink,
} from './commands';
import RecentList from './ui/RecentSearch';
import { EditorView } from 'prosemirror-view';
import { DispatchAnalyticsEvent } from '../analytics';
import { Mark } from 'prosemirror-model';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';

export const messages = defineMessages({
  openLink: {
    id: 'fabric.editor.openLink',
    defaultMessage: 'Open link in a new tab',
    description: 'Opens the link in a new tab',
  },
  unlink: {
    id: 'fabric.editor.unlink',
    defaultMessage: 'Unlink',
    description: 'Removes the hyperlink but keeps your text.',
  },
  editLink: {
    id: 'fabric.editor.editLink',
    defaultMessage: 'Edit link',
    description: 'Edit the link, update display text',
  },
});

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
  providerFactory,
  dispatchAnalyticsEvent?,
) => {
  const linkState: HyperlinkState | undefined = stateKey.getState(state);

  if (linkState && linkState.activeLinkMark) {
    const { activeLinkMark } = linkState;

    const hyperLinkToolbar = {
      title: 'Hyperlink floating controls',
      nodeType: [
        state.schema.nodes.text,
        state.schema.nodes.paragraph,
        state.schema.nodes.heading,
        state.schema.nodes.taskItem,
        state.schema.nodes.decisionItem,
      ].filter(nodeType => !!nodeType), // Use only the node types existing in the schema ED-6745
      align: 'left' as AlignType,
      className: activeLinkMark.type.match('INSERT|EDIT_INSERTED')
        ? 'hyperlink-floating-toolbar'
        : '',
    };

    switch (activeLinkMark.type) {
      case 'EDIT': {
        const { pos, node } = activeLinkMark;
        const linkMark = node.marks.filter(
          mark => mark.type === state.schema.marks.link,
        );
        const link = linkMark[0] && linkMark[0].attrs.href;

        const labelOpenLink = formatMessage(messages.openLink);
        const labelUnlink = formatMessage(messages.unlink);

        const editLink = formatMessage(messages.editLink);

        return {
          ...hyperLinkToolbar,
          height: 32,
          width: 250,
          items: [
            {
              type: 'button',
              onClick: editInsertedLink(pos),
              selected: false,
              title: editLink,
              showTitle: true,
            },
            {
              type: 'separator',
            },
            {
              type: 'button',
              target: '_blank',
              href: link,
              onClick: () => true,
              selected: false,
              title: labelOpenLink,
              icon: OpenIcon,
              className: 'hyperlink-open-link',
            },
            {
              type: 'separator',
            },
            {
              type: 'button',
              onClick: removeLink(pos),
              selected: false,
              title: labelUnlink,
              icon: UnlinkIcon,
            },
          ],
        };
      }

      case 'EDIT_INSERTED':
      case 'INSERT': {
        const { from, to } = activeLinkMark as InsertState;
        const { node } = activeLinkMark as EditInsertedState;
        let link: string;

        if (node) {
          const linkMark = node.marks.filter(
            (mark: Mark) => mark.type === state.schema.marks.link,
          );
          link = linkMark[0] && linkMark[0].attrs.href;
        }

        return {
          ...hyperLinkToolbar,
          height: 360,
          width: 420,
          items: [
            {
              type: 'custom',
              render: (
                view?: EditorView,
                idx?: number,
                dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
              ):
                | React.ComponentClass
                | React.SFC
                | React.ReactElement<any>
                | null => {
                if (!view) {
                  return null;
                }
                return (
                  <RecentList
                    key={idx}
                    displayUrl={link}
                    displayText={
                      linkState.activeText ||
                      ((activeLinkMark as EditInsertedState).node &&
                        (activeLinkMark as EditInsertedState).node.text)
                    }
                    providerFactory={providerFactory}
                    onSubmit={(href, text) => {
                      activeLinkMark.type === 'EDIT_INSERTED'
                        ? updateLink(href, text, activeLinkMark.pos)(
                            view.state,
                            view.dispatch,
                          )
                        : insertLink(from, to, href, text)(
                            view.state,
                            view.dispatch,
                          );
                      view.focus();
                    }}
                    onBlur={(type, url, text, isTabPressed) => {
                      switch (type) {
                        case 'url': {
                          if (url) {
                            return setLinkHref(
                              url,
                              (activeLinkMark as EditInsertedState).pos ||
                                (activeLinkMark as InsertState).from,
                              undefined,
                              isTabPressed,
                            )(view.state, view.dispatch);
                          }
                          return hideLinkToolbar()(view.state, view.dispatch);
                        }
                        case 'text': {
                          if (text && url) {
                            return setLinkText(
                              text,
                              (activeLinkMark as EditInsertedState).pos,
                            )(view.state, view.dispatch);
                          }
                          return hideLinkToolbar()(view.state, view.dispatch);
                        }
                        default: {
                          return hideLinkToolbar()(view.state, view.dispatch);
                        }
                      }
                    }}
                  />
                );
              },
            },
          ],
        };
      }
    }
  }
};
