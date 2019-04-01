import { keymap } from 'prosemirror-keymap';
import { Schema, Node } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { isEmptyNode } from '../../../utils';
import { Command } from '../../../types';
import { safeInsert } from 'prosemirror-utils';
import paragraph from '../../../../../renderer/src/email/nodes/paragraph';

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
    const { doc } = state;
    const index = $from.index($from.depth - 1);

    // Part 3.2: [selection{empty, at start}]
    if ($from.parentOffset > 0) {
      return false;
    }

    // Part 2: mediaSingle[wrap-right]
    const maybeMediaSingle = doc.maybeChild(index - 1);
    const isNotWrapRight =
      !maybeMediaSingle ||
      maybeMediaSingle.type !== schema.nodes.mediaSingle ||
      maybeMediaSingle.attrs.layout !== 'wrap-right';
    if (isNotWrapRight) {
      return false;
    }

    // Here is wrap right
    // Part 1: anyBlock[empty]
    const maybeAnyBlock = doc.maybeChild(index - 2);
    if (!maybeAnyBlock) {
      // the last is the image so should let the default behaviour delete the image
      return false;
    }

    // Should find the position
    // TODO: Should move the current paragraph to the last line
    const currentSelectionPos = $from.pos;
    const mediaSinglePos = currentSelectionPos - maybeMediaSingle!.nodeSize;
    const maybeAnyBlockPos = mediaSinglePos - maybeAnyBlock.nodeSize;
    const { paragraph } = schema.nodes;
    let tr = state.tr;
    if (isEmptyNodeInSchema(maybeAnyBlock)) {
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
