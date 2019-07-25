import { Node as PMNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { INLINE_COMMENT } from '@atlaskit/adf-schema';

import { Dispatch } from '../../../event-dispatcher';
import { shallowEqual } from '../../../utils';

import {
  AnnotationProvider,
  AnnotationToolbarAction,
  AnnotationToolbarState,
  AnnotationToolbarStateName,
  InlineCommentComponentProps,
} from '../types';

import { getActiveAnnotationMark, getActiveText } from '../utils';

export interface AnnotationPluginState {
  dom?: HTMLElement;
  activeText?: string;
  toolbarState?: AnnotationToolbarState;
  component?: React.ComponentType<InlineCommentComponentProps>;
  showComponent: boolean;
}

export const pluginKey = new PluginKey('annotationPlugin');

export function reduceTransaction(
  state: AnnotationToolbarState,
  tr: Transaction,
): AnnotationToolbarState {
  if (!state) {
    return undefined;
  }

  switch (state.type) {
    case AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR:
      const { pos, deleted } = tr.mapping.mapResult(state.pos, 1);
      const node = tr.doc.nodeAt(pos) as PMNode;

      // If the position was not deleted and it is still an annotation
      if (
        !deleted &&
        !!node.type.schema.marks.annotation.isInSet(node.marks) &&
        node === state.node &&
        pos === state.pos
      ) {
        return state;
      }

      return { ...state, pos, node };
    default:
      return undefined;
  }
}

export function reduceAction(editorState: EditorState) {
  return (
    state: AnnotationToolbarState,
    action: AnnotationToolbarAction,
  ): AnnotationToolbarState => {
    // Show insert or edit
    if (!state) {
      switch (action) {
        case AnnotationToolbarAction.SELECTION_CHANGE:
          // If the user has moved their cursor, see if they're in an annotation
          const annotation = getActiveAnnotationMark(editorState);

          if (annotation) {
            const { node, pos } = annotation;
            return {
              type: AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR,
              pos,
              node,
            };
          }
          return undefined;
        default:
          return undefined;
      }
    }

    // Update state if selection changes, or if component is hidden
    if (state.type === AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR) {
      switch (action) {
        case AnnotationToolbarAction.SELECTION_CHANGE: {
          const annotation = getActiveAnnotationMark(editorState);

          if (annotation) {
            if (
              annotation.pos === state.pos &&
              annotation.node === state.node
            ) {
              // Make sure we return the same object, if it's the same link
              return state;
            }
            return {
              ...annotation,
              type: AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR,
            };
          }

          return undefined;
        }
        default:
          return state;
      }
    }

    return state;
  };
}

export default function createPlugin(
  dispatch: Dispatch,
  provider?: AnnotationProvider,
) {
  return new Plugin({
    state: {
      init(_, editorState: EditorState): AnnotationPluginState {
        return {
          activeText: getActiveText(editorState),
          toolbarState: reduceAction(editorState)(
            undefined,
            AnnotationToolbarAction.SELECTION_CHANGE,
          ),
          component: (provider && provider.inlineCommentComponent) || undefined,
          showComponent: false,
        };
      },
      apply(
        tr,
        pluginState: AnnotationPluginState,
        _oldState,
        newState,
      ): AnnotationPluginState {
        let state = pluginState;

        const meta = tr.getMeta(pluginKey);

        if (tr.docChanged) {
          state = {
            ...state,
            activeText: getActiveText(newState),
            toolbarState: reduceTransaction(state.toolbarState, tr),
            showComponent: meta && meta.annotationType === INLINE_COMMENT,
          };
        }

        if (tr.selectionSet) {
          state = {
            ...state,
            dom:
              window.getSelection() && window.getSelection()!.anchorNode
                ? window.getSelection()!.anchorNode!.parentElement!
                : undefined,
            activeText: getActiveText(newState),
            toolbarState: reduceAction(newState)(
              state.toolbarState,
              AnnotationToolbarAction.SELECTION_CHANGE,
            ),
            showComponent: meta && meta.annotationType === INLINE_COMMENT,
          };
        }

        if (!shallowEqual(state, pluginState)) {
          dispatch(pluginKey, state);
        }

        return state;
      },
    },
    key: pluginKey,
  });
}
