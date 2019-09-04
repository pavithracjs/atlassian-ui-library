import { keymap } from 'prosemirror-keymap';
import {
  Node,
  Schema,
  NodeType,
  Fragment,
  Slice,
  ResolvedPos,
} from 'prosemirror-model';
import {
  EditorState,
  Transaction,
  Plugin,
  TextSelection,
} from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import {
  splitListAtSelection,
  insertTaskDecisionWithAnalytics,
} from '../commands';
import { INPUT_METHOD } from '../../analytics';
import { TaskDecisionListType } from '../types';
import { Command } from '../../../types';
import { canSplit, findWrapping } from 'prosemirror-transform';
import { liftListItem } from 'prosemirror-schema-list';
import { autoJoin } from 'prosemirror-commands';

const isInsideTaskOrDecisionItem = (state: EditorState) => {
  const { decisionItem, taskItem } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem, taskItem])(state.selection);
};

// node.depth < 2 check if to see if we're being called towards document level
function splitListItem(itemType: NodeType): Command {
  return function(state, dispatch) {
    let { $from, $to, from } = state.selection;
    const node = state.doc.nodeAt(from);

    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    let parent = $from.node(); // -1 for inline
    if (parent.type != itemType) return false;
    const grandParentItems: Node[] = [];
    $from.node(-1).content.forEach(listChild => {
      if (listChild.type.name === 'taskItem') {
        grandParentItems.push(listChild);
      }
    });

    if ($from.parent.content.size !== 0) {
      return false;
    }

    // In an empty block. If this is a nested list, the wrapping
    // list item should be split. Otherwise, bail out and let next
    // command handle lifting.
    if (
      $from.depth == 2 ||
      $from.node(-1).type.name != 'taskList' || // -1 for inline
      grandParentItems.indexOf(parent) != grandParentItems.length - 1 // -1 for inline
    ) {
      // debugger;
      return false;
    }
    if (dispatch) {
      const blockRange = $from.blockRange(state.doc.resolve($from.end(-1)));
      if (!blockRange) {
        return false;
      }

      dispatch(
        state.tr.lift(blockRange, blockRange.depth - 1).scrollIntoView(),
      );
    }

    return true;
  };
}

const getBlockRange = ($from: ResolvedPos) => {
  const { taskList } = $from.doc.type.schema.nodes;

  let end = $from.end();
  const after = $from.doc.resolve(end + 1).nodeAfter;
  console.log('after', after);

  // TODO: ensure they have the same depth
  if (after && after.type === taskList) {
    end += after.nodeSize;
  }

  return $from.blockRange($from.doc.resolve(end));
};

export function keymapPlugin(schema: Schema): Plugin | undefined {
  const keymaps = {
    'Shift-Tab': autoJoin(
      (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (!isInsideTaskOrDecisionItem(state)) {
          return false;
        }

        const { $from } = state.selection;
        if (dispatch) {
          // TODO: check that there's a taskItem preceeding it

          const blockRange = getBlockRange($from);
          if (!blockRange) {
            return false;
          }

          dispatch(
            state.tr.lift(blockRange, blockRange.depth - 1).scrollIntoView(),
          );
        }

        return true;
      },
      ['taskList'],
    ),

    Tab: autoJoin(
      (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (!isInsideTaskOrDecisionItem(state)) {
          return false;
        }

        const { $from } = state.selection;
        if (dispatch) {
          // if we're the first taskItem in a taskList, we want to move the taskItem up to the preceeding taskList
          // --------------------------------------
          // if ($from.index(-1) === 0) {
          //   console.warn('first taskItem');
          //   const blockRange = getBlockRange($from);
          //   if (!blockRange) {
          //     console.warn('no block range');
          //     return false;
          //   }

          //   dispatch(state.tr.join($from.start() - 1));
          //   // state.tr.join

          //   return true;
          // }

          // TODO: until end of next taskList
          const blockRange = getBlockRange($from);
          if (!blockRange) {
            return false;
          }

          console.log('block range', blockRange);

          const wrapping = findWrapping(
            blockRange,
            state.schema.nodes.taskList,
          );
          if (!wrapping) {
            console.error('no wrapping');
            // move as child
            return false;
          }

          dispatch(state.tr.wrap(blockRange, wrapping).scrollIntoView());
        }

        return true;
      },
      ['taskList'],
    ),
    Enter: (state: EditorState, dispatch: (tr: Transaction) => void) => {
      const { selection, tr } = state;
      const { $from } = selection;
      const nodeIsTaskOrDecisionItem = isInsideTaskOrDecisionItem(state);
      const node = $from.node($from.depth);
      const nodeType = node && node.type;
      const isEmpty = node && node.textContent.length === 0;
      const listType: TaskDecisionListType =
        nodeType === state.schema.nodes.taskItem ? 'taskList' : 'decisionList';

      if (nodeIsTaskOrDecisionItem) {
        // only do this if nested and non-empty
        // console.log('uh', $from.node(-2).type, 'empty?', isEmpty)
        // if (isEmpty && ($from.depth == 2 || $from.node(-1).type.name != 'taskList' || $from.node(-2).type.name != 'taskList')) {
        //   console.warn('trying to exit node');
        //   liftListItem(state.schema.nodes.taskItem)(state, dispatch);
        //   // dispatch(tr.split($from.pos, 1));
        //   return true;
        // }

        if (splitListItem(nodeType)(state, dispatch)) {
          return true;
        }

        // if (!isEmpty) {
        const addItem = ({
          tr,
          itemLocalId,
        }: {
          tr: Transaction;
          itemLocalId?: string;
        }) => {
          console.log('insert item');
          return tr.split($from.pos, 1, [
            { type: nodeType, attrs: { localId: itemLocalId } },
          ]);
        };

        const insertTr = insertTaskDecisionWithAnalytics(
          state,
          listType,
          INPUT_METHOD.KEYBOARD,
          addItem,
        );

        if (insertTr) {
          insertTr.scrollIntoView();
          dispatch(insertTr);
        }
        return true;
      }

      return false;
    },
  };
  return keymap(keymaps);
}

export default keymapPlugin;
