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
import {
  canSplit,
  findWrapping,
  Transform,
  ReplaceAroundStep,
} from 'prosemirror-transform';
import { liftListItem } from 'prosemirror-schema-list';
import { autoJoin } from 'prosemirror-commands';
import { findCutBefore } from '../../../utils/commands';

const isInsideTaskOrDecisionItem = (state: EditorState) => {
  const { decisionItem, taskItem } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem, taskItem])(state.selection);
};

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

const backspace = autoJoin(
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { $from } = state.selection;

    const $cut = findCutBefore($from);
    if ($cut) {
      console.log('$cut', $cut);

      if (
        $cut.nodeBefore &&
        $cut.nodeBefore.type.name === 'taskList' &&
        $cut.nodeAfter &&
        $cut.nodeAfter.type.name === 'paragraph'
      ) {
        // taskList contains taskItem, so this is the end of the inside
        const $dest = $cut.doc.resolve($cut.pos - 4);

        const slice = state.tr.doc.slice($dest.pos, $cut.pos);
        console.warn('slice', slice);

        // join them
        const tr = state.tr.step(
          new ReplaceAroundStep(
            $dest.pos,
            $cut.pos + $cut.nodeAfter.nodeSize,
            $cut.pos + 1,
            $cut.pos + $cut.nodeAfter.nodeSize - 1,
            slice,
            0,
            true,
          ),
        );

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }
    }

    if (!isInsideTaskOrDecisionItem(state) || $from.start() !== $from.pos) {
      return false;
    }

    // if nested, just unindent
    if ($from.node($from.depth - 2).type.name === 'taskList') {
      console.log('can unindent');
      return unindent(state, dispatch);
    }

    // bottom level, should "unwrap" taskItem contents into paragraph
    // we achieve this by slicing the content out, and replacing
    if (canSplitListItem(state.tr)) {
      console.log('can split');

      if (dispatch) {
        const taskContent = state.doc.slice($from.start(), $from.end()).content;

        // might be end of document after
        const slice = taskContent.size
          ? taskContent
          : state.schema.nodes.paragraph.createChecked();

        dispatch(splitListItemWith(state.tr, slice));
      }

      return true;
    }

    console.warn('no split or unindent');

    return false;
  },
  ['taskList'],
);

const canSplitListItem = (tr: Transaction) => {
  const { $from } = tr.selection;
  const afterTaskItem = tr.doc.resolve($from.end()).nodeAfter;

  return (
    !afterTaskItem || (afterTaskItem && afterTaskItem.type.name === 'taskItem')
  );
};

const splitListItemWith = (
  tr: Transaction,
  content: Fragment | Node | Node[],
) => {
  const { $from } = tr.selection;

  // split just before the current item
  // TODO: new id for split taskList
  tr = tr.split($from.pos - 1);

  // and delete the action at the current pos
  // we can do this because we know either first new child will be taskItem or nothing at all
  tr = tr.deleteRange(
    tr.mapping.map($from.pos),
    tr.mapping.map($from.end() + 1),
  );

  // taskList and taskItem positions collapse (nodes get deleted), so $from.pos is now the
  // start of the split taskList or remaining nodes in doc
  tr = tr.insert($from.pos, content);

  // put cursor inside paragraph
  tr = tr.setSelection(new TextSelection(tr.doc.resolve($from.pos + 1)));

  return tr;
};

const splitListItem = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
) => {
  let { tr } = state;
  const { schema } = state;

  if (canSplitListItem(tr)) {
    if (dispatch) {
      dispatch(splitListItemWith(tr, schema.nodes.paragraph.createChecked()));
    }
    return true;
  }

  return false;
};

export function keymapPlugin(schema: Schema): Plugin | undefined {
  const keymaps = {
    'Shift-Tab': unindent,
    Tab: indent,
    Backspace: backspace,

    Enter: (state: EditorState, dispatch: (tr: Transaction) => void) => {
      const { selection } = state;
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

      // not nested, exit the list if possible
      if (isEmpty && splitListItem(state, dispatch)) {
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
