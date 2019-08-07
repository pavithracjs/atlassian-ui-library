import * as React from 'react';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { InjectedIntl } from 'react-intl';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
} from '../../analytics';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../../floating-toolbar/types';
import {
  hideLinkingToolbar,
  setUrlToMedia,
  showLinkingToolbar,
  unlink,
} from '../commands/linking';
import { getMediaLinkingState, MediaLinkingState } from '../pm-plugins/linking';
import { linkToolbarMessages } from '../../../messages';
import MediaLinkingToolbar from '../ui/MediaLinkingToolbar';
import {
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '../../../ui/RecentSearch/ToolbarComponents';

export function shouldShowMediaLinkToolbar(editorState: EditorState): boolean {
  const mediaLinkingState = getMediaLinkingState(editorState);
  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return false;
  }
  const {
    nodes: { mediaSingle },
    marks: { link },
  } = editorState.schema;
  const $pos = editorState.doc.resolve(mediaLinkingState.mediaPos);
  const node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);
  const { parent } = $pos;

  return (
    !!node &&
    parent &&
    node.type === mediaSingle &&
    parent.type.allowsMarkType(link)
  );
}

export const buildLinkingButtons = (
  state: EditorState,
  intl: InjectedIntl,
): Array<FloatingToolbarItem<Command>> => {
  const mediaLinkingState = getMediaLinkingState(state);
  if (mediaLinkingState.editable) {
    return [
      {
        type: 'button',
        onClick: showLinkingToolbar,
        selected: false,
        title: intl.formatMessage(linkToolbarMessages.editLink),
        showTitle: true,
      },
      { type: 'separator' },
      {
        type: 'button',
        target: '_blank',
        href: mediaLinkingState.link,
        onClick: (state, dispatch) => {
          // Track if is visited
          if (dispatch) {
            dispatch(
              addAnalytics(state.tr, {
                eventType: EVENT_TYPE.TRACK,
                action: ACTION.VISITED,
                actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
                actionSubjectId: ACTION_SUBJECT_ID.MEDIA_LINK,
              }),
            );
          }
          return true;
        },
        selected: false,
        title: intl.formatMessage(linkToolbarMessages.openLink),
        icon: OpenIcon,
        className: 'hyperlink-open-link',
      },
    ];
  }
  return [
    {
      type: 'button',
      icon: LinkIcon,
      title: intl.formatMessage(linkToolbarMessages.addLink),
      onClick: showLinkingToolbar,
    },
  ];
};

type MediaToolbarBaseConfig = {
  title: string;
  getDomRef?: (view: EditorView) => HTMLElement | undefined;
  nodeType: NodeType | NodeType[];
};

export const getLinkingToolbar = (
  toolbarBaseConfig: MediaToolbarBaseConfig,
  mediaLinkingState: MediaLinkingState,
  state: EditorState,
  intl: InjectedIntl,
  providerFactory?: ProviderFactory,
): FloatingToolbarConfig | undefined => {
  const { link, visible, editable: editing, mediaPos } = mediaLinkingState;

  if (visible && mediaPos !== null) {
    const node = state.doc.nodeAt(mediaPos);
    if (node) {
      return {
        ...toolbarBaseConfig,
        height: RECENT_SEARCH_HEIGHT_IN_PX,
        width: RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
        items: [
          {
            type: 'custom',
            render: (view, idx) => {
              if (!view || !providerFactory) {
                return null;
              }
              return (
                <MediaLinkingToolbar
                  key={idx}
                  displayUrl={link}
                  providerFactory={providerFactory}
                  intl={intl}
                  editing={editing}
                  onUnlink={() => unlink(view.state, view.dispatch, view)}
                  onBack={(href, meta) => {
                    if (href.trim() && meta.inputMethod) {
                      setUrlToMedia(href, meta.inputMethod)(
                        view.state,
                        view.dispatch,
                        view,
                      );
                    }
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                  onCancel={() =>
                    hideLinkingToolbar(view.state, view.dispatch, view)
                  }
                  onSubmit={(href, meta) => {
                    setUrlToMedia(href, meta.inputMethod)(
                      view.state,
                      view.dispatch,
                      view,
                    );
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                  onBlur={() => {
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                />
              );
            },
          },
        ],
      };
    }
  }
};
