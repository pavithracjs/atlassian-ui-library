import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { isEmptyNode } from '../../../utils';
import { Command } from '../../../types';

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
    // anyBlock[empty] > mediaSingle[wrap-right] > [selection{empty, at start}]
    if (!selection.empty) {
      return false;
    }

    const { $from } = selection;
    const { doc } = state;
    const index = $from.index($from.depth - 1);

    if ($from.parentOffset > 0) {
      return false;
    }

    const maybeMediaSingle = doc.maybeChild(index - 1);
    const isNotWrapRight =
      !maybeMediaSingle ||
      maybeMediaSingle.type !== schema.nodes.mediaSingle ||
      maybeMediaSingle.attrs.layout !== 'wrap-right';
    if (isNotWrapRight) {
      return false;
    }

    // Here is wrap right
    const maybeAnyBlock = doc.maybeChild(index - 2);
    if (!maybeAnyBlock || isEmptyNodeInSchema(maybeAnyBlock)) {
      // the last is the image so should let the default behaviour delete the image
      return false;
    }

    // Should find the position
    let tr = state.tr;
    doc.forEach((node, offset, currentIndex) => {
      if (currentIndex === index - 2) {
        tr = tr.replace(
          offset + maybeAnyBlock.nodeSize - 2,
          offset + maybeAnyBlock.nodeSize - 1,
        );
        tr.setSelection(
          Selection.findFrom(
            tr.doc.resolve(offset + maybeAnyBlock.nodeSize - 2),
            -1,
            true,
          )!,
        );
      }
      return;
    });

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
