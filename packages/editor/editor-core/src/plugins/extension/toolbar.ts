import { defineMessages, InjectedIntl } from 'react-intl';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';

import { ExtensionHandlers } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

import { Command } from '../../types';
import commonMessages from '../../messages';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import {
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import {
  updateExtensionLayout,
  editExtension,
  removeExtension,
} from './actions';
import { pluginKey, ExtensionState } from './plugin';
import { hoverDecoration } from '../base/pm-plugins/decoration';

export const messages = defineMessages({
  edit: {
    id: 'fabric.editor.edit',
    defaultMessage: 'Edit',
    description: 'Edit the properties for this extension.',
  },
});

const isLayoutSupported = (
  state: EditorState,
  selectedExtNode: { pos: number; node: PMNode },
) => {
  const {
    schema: {
      nodes: { bodiedExtension, extension, layoutSection, table },
    },
    selection,
  } = state;

  if (!selectedExtNode) {
    return false;
  }

  return !!(
    (selectedExtNode.node.type === bodiedExtension ||
      (selectedExtNode.node.type === extension &&
        !hasParentNodeOfType([bodiedExtension, table])(selection))) &&
    !hasParentNodeOfType([layoutSection])(selection)
  );
};

const breakoutOptions = (
  state: EditorState,
  formatMessage: InjectedIntl['formatMessage'],
  extensionState: ExtensionState,
): Array<FloatingToolbarItem<Command>> => {
  const { layout, allowBreakout, node } = extensionState;
  return allowBreakout && isLayoutSupported(state, node)
    ? [
        {
          type: 'button',
          icon: CenterIcon,
          onClick: updateExtensionLayout('default'),
          selected: layout === 'default',
          title: formatMessage(commonMessages.layoutFixedWidth),
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: updateExtensionLayout('wide'),
          selected: layout === 'wide',
          title: formatMessage(commonMessages.layoutWide),
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: updateExtensionLayout('full-width'),
          selected: layout === 'full-width',
          title: formatMessage(commonMessages.layoutFullWidth),
        },
      ]
    : [];
};

const editButton = (
  formatMessage: InjectedIntl['formatMessage'],
  macroState: MacroState,
  extensionState: ExtensionState,
  extensionHandlers: ExtensionHandlers | undefined,
): Array<FloatingToolbarItem<Command>> => {
  const { extensionType } = extensionState.node.node.attrs;
  const extension = extensionHandlers && extensionHandlers[extensionType];
  if (typeof extension === 'object' && !extension.update) {
    return [];
  }

  return [
    {
      type: 'button',
      icon: EditIcon,
      onClick: editExtension(
        macroState && macroState.macroProvider,
        extensionHandlers,
      ),
      title: formatMessage(messages.edit),
    },
  ];
};

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
  _providerFactory,
  props,
) => {
  const extensionState: ExtensionState = pluginKey.getState(state);
  const macroState: MacroState = macroPluginKey.getState(state);
  if (extensionState && extensionState.element) {
    const nodeType = [
      state.schema.nodes.extension,
      state.schema.nodes.inlineExtension,
      state.schema.nodes.bodiedExtension,
    ];

    return {
      title: 'Extension floating controls',
      getDomRef: () => extensionState.element!.parentElement || undefined,
      nodeType,
      items: [
        ...editButton(
          formatMessage,
          macroState,
          extensionState,
          props && props.extensionHandlers,
        ),
        ...breakoutOptions(state, formatMessage, extensionState),
        {
          type: 'separator',
        },
        {
          type: 'button',
          icon: RemoveIcon,
          appearance: 'danger',
          onClick: removeExtension(),
          onMouseEnter: hoverDecoration(nodeType, true),
          onMouseLeave: hoverDecoration(nodeType, false),
          title: formatMessage(commonMessages.remove),
        },
      ],
    };
  }
  return;
};
