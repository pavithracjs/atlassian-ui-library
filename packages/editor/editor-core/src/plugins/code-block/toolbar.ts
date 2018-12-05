import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {
  FloatingToolbarHandler,
  FloatingToolbarButton,
  FloatingToolbarSeparator,
} from '../floating-toolbar/types';
import { removeCodeBlock } from './actions';
import commonMessages from '../../messages';
import { pluginKey, CodeBlockState } from './pm-plugins/main';
import { Command } from '../../types';
import { createBreakoutToolbarItems } from '../breakout/utils/create-breakout-toolbar-items';

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  if (
    codeBlockState &&
    codeBlockState.toolbarVisible &&
    codeBlockState.element
  ) {
    const breakoutToolbar = createBreakoutToolbarItems(state, {
      formatMessage,
    });

    const separator: FloatingToolbarSeparator = {
      type: 'separator',
    };

    const deleteButton: FloatingToolbarButton<Command> = {
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onClick: removeCodeBlock,
      title: formatMessage(commonMessages.remove),
    };

    return {
      title: 'CodeBlock floating controls',
      getDomRef: () => codeBlockState.element,
      nodeType: state.schema.nodes.codeBlock,
      items: [
        ...(breakoutToolbar ? [...breakoutToolbar, separator] : []),
        deleteButton,
      ],
    };
  }
};
