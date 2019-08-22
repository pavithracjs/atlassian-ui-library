import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../../messages';
import { Command } from '../../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../../../../src/plugins/floating-toolbar/types';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import { hoverDecoration } from '../../base/pm-plugins/decoration';
import { renderAnnotationButton } from './annotation';
import {
  getLinkingToolbar,
  buildLinkingButtons,
  shouldShowMediaLinkToolbar,
} from './linking';
import buildLayoutButtons from './buildMediaLayoutButtons';
import { ProviderFactory } from '@atlaskit/editor-common';
import { MediaLinkingState, getMediaLinkingState } from '../pm-plugins/linking';

const remove: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeSelectedNode(state.tr));
  }
  return true;
};

export type MediaFloatingToolbarOptions = {
  providerFactory?: ProviderFactory;
  allowResizing?: boolean;
  allowAnnotation?: boolean;
  allowLinking?: boolean;
  allowAdvancedToolBarOptions?: boolean;
  allowResizingInTables?: boolean;
};

export const floatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  options: MediaFloatingToolbarOptions = {},
): FloatingToolbarConfig | undefined => {
  const {
    providerFactory,
    allowResizing,
    allowAnnotation,
    allowLinking,
    allowAdvancedToolBarOptions,
    allowResizingInTables,
  } = options;
  const { mediaSingle } = state.schema.nodes;
  const pluginState: MediaPluginState | undefined = stateKey.getState(state);
  const mediaLinkingState: MediaLinkingState = getMediaLinkingState(state);

  if (!mediaSingle || !pluginState) {
    return;
  }
  const baseToolbar = {
    title: 'Media floating controls',
    nodeType: mediaSingle,
    getDomRef: () => pluginState.element,
  };

  if (
    allowLinking &&
    mediaLinkingState &&
    mediaLinkingState.visible &&
    shouldShowMediaLinkToolbar(state)
  ) {
    const linkingToolbar = getLinkingToolbar(
      baseToolbar,
      mediaLinkingState,
      state,
      intl,
      providerFactory,
    );
    if (linkingToolbar) {
      return linkingToolbar;
    }
  }

  let toolbarButtons: FloatingToolbarItem<Command>[] = [];
  if (allowAdvancedToolBarOptions) {
    toolbarButtons = buildLayoutButtons(
      state,
      intl,
      allowResizing,
      allowResizingInTables,
    );
    if (toolbarButtons.length) {
      if (allowAnnotation) {
        toolbarButtons.push({
          type: 'custom',
          render: renderAnnotationButton(pluginState, intl),
        });
      }
    }

    if (allowLinking && shouldShowMediaLinkToolbar(state)) {
      if (toolbarButtons.length) {
        toolbarButtons.push({ type: 'separator' });
      }

      const linkingButtons = buildLinkingButtons(state, intl);
      toolbarButtons.push(...linkingButtons);
    }

    if (toolbarButtons.length) {
      toolbarButtons.push({ type: 'separator' });
    }
  }

  return {
    ...baseToolbar,
    items: [
      ...toolbarButtons,
      {
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        onMouseEnter: hoverDecoration(mediaSingle, true),
        onMouseLeave: hoverDecoration(mediaSingle, false),
        title: intl.formatMessage(commonMessages.remove),
        onClick: remove,
      },
    ],
  };
};
