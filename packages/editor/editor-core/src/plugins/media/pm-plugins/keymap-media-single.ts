import { keymap } from 'prosemirror-keymap';
import { Schema, NodeType, Node } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { isEmptyNode, atTheEndOfDoc, lastNodeInDocument } from '../../../utils';
import { Command, CommandDispatch } from '../../../types';
import { safeInsert } from 'prosemirror-utils';
import { selectNodeBackward } from 'prosemirror-commands';

/**
 * Check if is an empty selection at the start of the node
 */
function isEmptySelectionAtStart(state: EditorState) {
  const { selection } = state;

  // Part 3,1: [selection{empty}]
  if (!selection.empty) {
    return false;
  }

  const { $from } = selection;

  // Part 3.2: [selection{empty, at start}]
  if ($from.parentOffset > 0) {
    return false;
  }

  return true;
}

/**
 * Check if the current selection is inside a paragraph
 */
function isInsideAParagraph(state: EditorState): boolean {
  const { $from } = state.selection;
  const { paragraph } = state.schema.nodes;
  const parent = $from.parent;

  const insideParapraph = parent.type === paragraph;
  if (!insideParapraph) {
    return false;
  }
  return true;
}

/**
 * Return the sibling of the current selection
 */
function getSibling(
  state: EditorState,
  sibling: number,
): Node | null | undefined {
  const { $from } = state.selection;
  const index = $from.index($from.depth - 1);
  const grandParent = $from.node($from.depth - 1); // Get GrandParent

  return grandParent.maybeChild(index + sibling);
}

/**
 * Check if respective sibling (negative number previous, positive number next)
 * is from the specified node
 */
function isSiblingOfType(
  state: EditorState,
  node: NodeType,
  sibling: number,
): boolean {
  const maybeSiblingNode = getSibling(state, sibling);
  if (!maybeSiblingNode || maybeSiblingNode.type !== node) {
    return false;
  }
  return true;
}
/**
 * When there's any empty block before another paragraph with wrap-right
 * mediaSingle. Pressing backspace at the start of the paragraph will select
 * the media but visually it makes more sense to remove the empty paragraph.
 *
 * Structure of the document: doc(block(), mediaSingle(media()), paragraph('{<>}hello!'))
 * But, visually it looks like the following:
 *
 *    [empty block] <- Remove this block
 * or [paragraph block] <- Move text inside this paragraph
 * or [any other block] <- Move paragraph node after this node
 * [Cursor] x x x x x x x x  +---------------+
 * x x x x x x x x x x       |  mediaSingle  |
 * x x x x x.                +---------------+
 */
function handleSelectionAfterWrapRight(isEmptyNode: (node: Node) => any) {
  function isEmptyWithoutThrow(node: Node): any {
    let isEmpty = false;
    try {
      isEmpty = isEmptyNode(node);
    } catch (e) {}
    return isEmpty;
  }
  return (state: EditorState, dispatch?: CommandDispatch) => {
    const { $from } = state.selection;
    const { paragraph } = state.schema.nodes;

    const previousMediaSingleSibling = -2;
    const maybeSibling = getSibling(state, previousMediaSingleSibling);

    if (!maybeSibling) {
      // the last is the image so should let the default behaviour delete the image
      return false;
    }

    const mediaSingle = getSibling(state, -1)!; // Sibling is a media single already checked in main code
    const mediaSinglePos = $from.pos - mediaSingle.nodeSize;

    // Should find the position
    // Should move the current paragraph to the last line
    const maybeAnyBlockPos = mediaSinglePos - maybeSibling.nodeSize;
    let tr = state.tr;

    if (isEmptyWithoutThrow(maybeSibling)) {
      // Should remove the empty sibling
      tr = tr.replace(
        maybeAnyBlockPos - 1,
        maybeAnyBlockPos + maybeSibling.nodeSize,
      );
    } else {
      // We move the current node, to the new position
      // 1. Remove current node, only if I am not removing the last node.
      if (!lastNodeInDocument(state)) {
        tr.replace($from.pos - 1, $from.pos + $from.parent.nodeSize - 1); // Remove node
      } else {
        // Remove node content, if is the last node, let a empty paragraph
        tr.replace($from.pos, $from.pos + $from.parent.nodeSize - 1);
      }

      // 2. Add it in the new position
      // If the sibling is a paragraph lets copy the text inside the paragraph
      // Like a normal backspace from paragraph to paragraph
      if (maybeSibling.type === paragraph) {
        const insideParagraphPos = maybeAnyBlockPos + maybeSibling.nodeSize - 2;
        safeInsert($from.parent.content, insideParagraphPos)(tr);
      } else {
        // If is any other kind of block just add the paragraph after it
        const endOfBlockPos = maybeAnyBlockPos + maybeSibling.nodeSize - 1;
        safeInsert($from.parent!.copy($from.parent.content), endOfBlockPos)(tr);
      }
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

const maybeRemoveMediaSingleNode = (schema: Schema): Command => {
  const isEmptyNodeInSchema = isEmptyNode(schema);
  return (state, dispatch) => {
    const { selection, schema } = state;
    const { $from } = selection;

    // Part 3,1: [selection{empty, at start}]
    if (!isEmptySelectionAtStart(state)) {
      return false;
    }

    if (!isInsideAParagraph(state)) {
      return false;
    }

    const previousSibling = -1;
    if (!isSiblingOfType(state, schema.nodes.mediaSingle, previousSibling)) {
      // no media single
      return false;
    }

    const mediaSingle = getSibling(state, previousSibling)!;

    if (mediaSingle.attrs.layout === 'wrap-right') {
      return handleSelectionAfterWrapRight(isEmptyNodeInSchema)(
        state,
        dispatch,
      );
    }

    if (dispatch) {
      // Select media single, and remove paragraph if it's empty.
      selectNodeBackward(state, tr => {
        if (isEmptyNodeInSchema($from.parent) && !atTheEndOfDoc(state)) {
          tr.replace($from.pos - 1, $from.pos + $from.parent.nodeSize - 1); // Remove node
        }
        dispatch(tr);
      });
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
