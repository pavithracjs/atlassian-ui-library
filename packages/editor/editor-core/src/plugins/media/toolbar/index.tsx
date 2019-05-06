import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../../messages';
import { Command, EditorAppearance } from '../../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../../../../src/plugins/floating-toolbar/types';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import { hoverDecoration } from '../../base/pm-plugins/decoration';
import { isFullPage } from '../../../utils/is-full-page';
import { renderAnnotationButton } from './annotation';
import buildMediaLayoutButtons from './buildMediaLayoutButtons';

const remove: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeSelectedNode(state.tr));
  }
  return true;
};

export const floatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  allowResizing?: boolean,
  allowAnnotation?: boolean,
  appearance?: EditorAppearance,
): FloatingToolbarConfig | undefined => {
  const { mediaSingle } = state.schema.nodes;
  const pluginState: MediaPluginState | undefined = stateKey.getState(state);

  if (!mediaSingle || !pluginState) {
    return;
  }

  let layoutButtons: FloatingToolbarItem<Command>[] = [];
  if (isFullPage(appearance)) {
    layoutButtons = buildMediaLayoutButtons(state, intl, allowResizing);
    if (layoutButtons.length) {
      if (allowAnnotation) {
        layoutButtons.push({
          type: 'custom',
          render: renderAnnotationButton(pluginState, intl),
        });
      }

      layoutButtons.push({ type: 'separator' });
    }
  }

  return {
    title: 'Media floating controls',
    nodeType: mediaSingle,
    getDomRef: () => pluginState.element,
    items: [
      ...layoutButtons,
      {
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        onMouseEnter: hoverDecoration(true),
        onMouseLeave: hoverDecoration(false),
        title: intl.formatMessage(commonMessages.remove),
        onClick: remove,
      },
    ],
  };
};
