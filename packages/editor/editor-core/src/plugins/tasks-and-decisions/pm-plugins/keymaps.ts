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

const getBlockRange = ($from: ResolvedPos, $to: ResolvedPos) => {
  const { taskList } = $from.doc.type.schema.nodes;

  let end = $to.end();
  const after = $to.doc.resolve(end + 1).nodeAfter;
  console.log('after', after);

  // TODO: ensure they have the same depth
  if (after && after.type === taskList) {
    end += after.nodeSize;
  }

  return $from.blockRange($to.doc.resolve(end));
};

const unindent = autoJoin(
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    if (!isInsideTaskOrDecisionItem(state)) {
      return false;
    }

    const { $from, $to } = state.selection;
    if (dispatch) {
      const blockRange = getBlockRange($from, $to);
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
);

const indent = autoJoin(
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    if (!isInsideTaskOrDecisionItem(state)) {
      return false;
    }

    const { $from, $to } = state.selection;
    if (dispatch) {
      const blockRange = getBlockRange($from, $to);
      if (!blockRange) {
        return false;
      }

      const wrapping = findWrapping(blockRange, state.schema.nodes.taskList);
      if (!wrapping) {
        return false;
      }

      dispatch(state.tr.wrap(blockRange, wrapping).scrollIntoView());
    }

    return true;
  },
  ['taskList'],
);

export function keymapPlugin(schema: Schema): Plugin | undefined {
  const keymaps = {
    'Shift-Tab': unindent,
    Tab: indent,

    Enter: (state: EditorState, dispatch: (tr: Transaction) => void) => {
      const { selection } = state;
      let tr = state.tr;
      const { $from } = selection;
      const node = $from.node($from.depth);
      const nodeType = node && node.type;
      const isEmpty = node && node.textContent.length === 0;
      const listType: TaskDecisionListType =
        nodeType === state.schema.nodes.taskItem ? 'taskList' : 'decisionList';

      if (!isInsideTaskOrDecisionItem(state)) {
        return false;
      }

      // unindent if it's an empty nested taskItem (inside taskList)
      if (isEmpty && $from.node($from.depth - 2).type.name === 'taskList') {
        return unindent(state, dispatch);
      }

      const afterTaskItem = tr.doc.resolve($from.pos + 1).nodeAfter;

      // not nested, exit the list if possible
      if (
        isEmpty &&
        (!afterTaskItem ||
          (afterTaskItem && afterTaskItem.type.name === 'taskItem'))
      ) {
        // split just before the current item
        // TODO: new id for split taskList
        tr = tr.split($from.pos - 1);

        // and delete the action at the current pos
        // we can do this because we know either first new child will be taskItem or nothing at all
        tr = tr.deleteRange($from.pos + 2, $from.pos + 3);

        // taskList and taskItem positions collapse (nodes get deleted), so $from.pos is now the
        // start of the split taskList or remaining nodes in doc
        tr = tr.insert($from.pos, schema.nodes.paragraph.createChecked());

        // put cursor inside paragraph
        tr = tr.setSelection(new TextSelection(tr.doc.resolve($from.pos + 1)));

        dispatch(tr);
        return true;
      }

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
    },
  };
  return keymap(keymaps);
}

export default keymapPlugin;
