import { DecorationSet, Decoration } from 'prosemirror-view';
import {
  PluginKey,
  Plugin,
  EditorState,
  NodeSelection,
} from 'prosemirror-state';
import { Command } from '../../../types';
import {
  pluginKey as floatingToolbarPluginKey,
  getRelevantConfig,
} from '../../floating-toolbar/index';
import { FloatingToolbarConfig } from '../../floating-toolbar/types';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';

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

  let parentNode: Node;
  let from: number;
  if (state.selection instanceof NodeSelection) {
    parentNode = state.selection.node;
    const nodeTypes = Array.isArray(config.nodeType)
      ? config.nodeType
      : [config.nodeType];
    if (nodeTypes.indexOf(parentNode.type) < 0) {
      return false;
    }
    from = state.selection.from;
  } else {
    const foundParentNode = findParentNodeOfType(config.nodeType)(
      state.selection,
    );
    if (!foundParentNode) {
      return false;
    }
    from = foundParentNode.pos;
    parentNode = foundParentNode.node;
  }

  if (!parentNode) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .setMeta(decorationStateKey, {
          action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
          data: Decoration.node(
            from,
            from + parentNode.nodeSize,
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
