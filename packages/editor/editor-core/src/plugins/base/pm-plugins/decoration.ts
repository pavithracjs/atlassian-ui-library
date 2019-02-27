import { DecorationSet, Decoration } from 'prosemirror-view';
import { PluginKey, Plugin, EditorState } from 'prosemirror-state';
import { Command } from '../../../types';
import {
  pluginKey as floatingToolbarPluginKey,
  getRelevantConfig,
} from '../../floating-toolbar/index';
import { FloatingToolbarConfig } from '../../floating-toolbar/types';
import { findParentNodeOfType } from 'prosemirror-utils';

export const decorationStateKey = new PluginKey('decorationPlugin');

export enum ACTIONS {
  DECORATION_ADD,
  DECORATION_REMOVE,
}

export const hoverDecoration = (
  add: boolean,
  className: string = 'danger',
): Command => (state, dispatch) => {
  const floatingToolbarConfigs:
    | Array<FloatingToolbarConfig>
    | undefined = floatingToolbarPluginKey.getState(state);

  if (!floatingToolbarConfigs) {
    return false;
  }

  const config = getRelevantConfig(state, floatingToolbarConfigs);
  if (!config) {
    return false;
  }

  const parentNode = findParentNodeOfType(config.nodeType)(state.selection);
  if (!parentNode) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(decorationStateKey, {
          action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
          data: Decoration.node(
            parentNode.pos,
            parentNode.pos + parentNode.node.nodeSize,
            {
              class: className,
            },
            { key: 'decorationNode' },
          ),
        })
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export default () => {
  return new Plugin({
    key: decorationStateKey,

    state: {
      init: () => ({ decorations: undefined }),
      apply(tr, pluginState) {
        const meta = tr.getMeta(decorationStateKey);
        if (!meta) {
          return pluginState;
        }

        switch (meta.action) {
          case ACTIONS.DECORATION_ADD:
            return {
              decorations: meta.data,
            };
          case ACTIONS.DECORATION_REMOVE:
            return { decorations: undefined };
          default:
            return pluginState;
        }
      },
    },

    props: {
      decorations(state: EditorState) {
        const { doc } = state;
        const { decorations } = decorationStateKey.getState(state);
        if (decorations) {
          return DecorationSet.create(doc, [decorations]);
        }
        return null;
      },
    },
  });
};
