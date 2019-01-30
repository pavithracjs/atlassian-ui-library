import { Node as PmNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { IndentationMarkAttributes } from '@atlaskit/adf-schema';
import { toggleBlockMark } from '../../../commands';
import { Command } from '../../../types/command';

const isIndentationAllowed = (
  state: EditorState,
  node: PmNode,
  parent: PmNode,
) => {
  const {
    nodes: { paragraph, heading, bulletList, orderedList, codeBlock },
    marks: { alignment },
  } = state.schema;

  /**
   * This function gets nodes in top-down order. So in case of a `codeBlock`
   * inside `list` we need to bail early.
   */
  if (state.selection.$anchor.node().type === codeBlock) {
    return false;
  }

  if ([paragraph, heading, bulletList, orderedList].indexOf(node.type) > -1) {
    if (alignment) {
      const hasAlignment = node.marks.filter(
        mark => mark.type === alignment,
      )[0];
      return !hasAlignment;
    }
    return true;
  }
  return false;
};

export const indent: Command = (state, dispatch) => {
  const { indentation } = state.schema.marks;

  return toggleBlockMark<IndentationMarkAttributes>(
    indentation,
    oldMark =>
      // No mark - add a mark with level 1
      !oldMark
        ? { level: 1 }
        : // Level is at 6 or higher - do nothing
        oldMark.level >= 6
        ? undefined
        : // For other cases - increase level by 1
          { level: oldMark.level + 1 },
    isIndentationAllowed,
  )(state, dispatch);
};

export const outdent: Command = (state, dispatch) => {
  const { indentation } = state.schema.marks;
  return toggleBlockMark<IndentationMarkAttributes>(
    indentation,
    oldMark =>
      // No mark - do nothing
      !oldMark
        ? undefined
        : // Level is at 1 or lower - remove the mark
        oldMark.level <= 1
        ? false
        : // For other cases - decrease level by 1
          { level: oldMark.level - 1 },
    isIndentationAllowed,
  )(state, dispatch);
};

export const removeIndentation: Command = (state, dispatch) =>
  toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);
