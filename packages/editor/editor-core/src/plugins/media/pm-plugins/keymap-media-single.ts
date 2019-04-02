import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { isEmptyNode } from '../../../utils';
import { Command } from '../../../types';
import { safeInsert } from 'prosemirror-utils';
import { selectNodeBackward } from 'prosemirror-commands';

/**
 * When there's any empty block before another paragraph with wrap-right
 * mediaSingle. Pressing backspace at the start of the paragraph will select
 * the media but visually it makes more sense to remove the empty paragraph.
 *
 * Structure of the document: doc(block(), mediaSingle(media()), paragraph('{<>}hello!'))
 * But, visually it looks like the following:
 *
 * [empty block] <- Remove this block
 * [Cursor] x x x x x x x x  +---------------+
 * x x x x x x x x x x       |  mediaSingle  |
 * x x x x x.                +---------------+
 */
const maybeRemoveMediaSingleNode = (schema: Schema): Command => {
  const isEmptyNodeInSchema = isEmptyNode(schema);
  return (state, dispatch) => {
    const { selection } = state;
    // Check if we have a structure like
    // Doc/BlockNode:
    //    anyBlock[empty] |
    //    mediaSingle[wrap-right]
    //    [selection{empty, at start}]

    // Part 3,1: [selection{empty}]
    if (!selection.empty) {
      return false;
    }

    const { $from } = selection;
    const { paragraph } = state.schema.nodes;
    const parent = $from.parent;

    const insideParapraph = parent.type === paragraph;
    if (!insideParapraph) {
      return false;
    }

    const index = $from.index($from.depth - 1);
    const grandParent = $from.node($from.depth - 1);
    // Part 3.2: [selection{empty, at start}]
    if ($from.parentOffset > 0) {
      return false;
    }

    // Part 2: mediaSingle[wrap-right]
    const maybeMediaSingle = grandParent.maybeChild(index - 1);
    if (
      !maybeMediaSingle ||
      maybeMediaSingle.type !== schema.nodes.mediaSingle
    ) {
      // No media single
      return false;
    }

    // Calculate positions
    const currentSelectionPos = $from.pos;
    const mediaSinglePos = currentSelectionPos - maybeMediaSingle!.nodeSize;

    // If media single layout is not wrap right, should set selection
    if (maybeMediaSingle.attrs.layout !== 'wrap-right') {
      if (dispatch) {
        selectNodeBackward(state, dispatch);
      }
      return true;
    }

    // Now we handle wrap right case

    // Here is wrap right
    // Part 1: anyBlock[empty]
    const maybeAnyBlock = grandParent.maybeChild(index - 2);
    if (!maybeAnyBlock) {
      // the last is the image so should let the default behaviour delete the image
      return false;
    }

    // Should find the position
    // Should move the current paragraph to the last line
    const maybeAnyBlockPos = mediaSinglePos - maybeAnyBlock.nodeSize;
    let tr = state.tr;
    let isEmptyNode = false;
    try {
      isEmptyNode = isEmptyNodeInSchema(maybeAnyBlock);
    } catch (e) {}

    if (isEmptyNode) {
      tr = tr.replace(
        maybeAnyBlockPos - 1,
        maybeAnyBlockPos + maybeAnyBlock.nodeSize,
      );
    } else {
      tr.replace($from.pos, $from.pos + $from.parent.nodeSize - 1); // Remove content let empty paragraph;
      if (maybeAnyBlock.type === paragraph) {
        const insideParagraphPos =
          maybeAnyBlockPos + maybeAnyBlock.nodeSize - 2;
        safeInsert($from.parent.content, insideParagraphPos)(tr);
      } else {
        // Move content ups
        const endOfBlockPos = maybeAnyBlockPos + maybeAnyBlock.nodeSize - 1;
        safeInsert($from.parent!.copy($from.parent.content), endOfBlockPos)(tr);
      }
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};
  const removeMediaSingleCommand = maybeRemoveMediaSingleNode(schema);

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    removeMediaSingleCommand,
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
