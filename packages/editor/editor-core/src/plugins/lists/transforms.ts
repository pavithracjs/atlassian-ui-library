import { Fragment, NodeRange, Slice, ResolvedPos } from 'prosemirror-model';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import { getListLiftTarget } from './utils';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';

function liftListItem(
  state: EditorState,
  selection,
  tr: Transaction,
): Transaction {
  let { $from, $to } = selection;
  const nodeType = state.schema.nodes.listItem;
  let range = $from.blockRange(
    $to,
    node => node.childCount && node.firstChild.type === nodeType,
  );
  if (
    !range ||
    range.depth < 2 ||
    $from.node(range.depth - 1).type !== nodeType
  ) {
    return tr;
  }
  let end = range.end;
  let endOfList = $to.end(range.depth);
  if (end < endOfList) {
    tr.step(
      new ReplaceAroundStep(
        end - 1,
        endOfList,
        end,
        endOfList,
        new Slice(
          Fragment.from(nodeType.create(undefined, range.parent.copy())),
          1,
          0,
        ),
        1,
        true,
      ),
    );

    range = new NodeRange(
      tr.doc.resolve($from.pos),
      tr.doc.resolve(endOfList),
      range.depth,
    );
  }
  return tr.lift(range, liftTarget(range) as number).scrollIntoView();
}

// Function will lift list item following selection to level-1.
export function liftFollowingList(
  state: EditorState,
  from: number,
  to: number,
  rootListDepth: number,
  tr: Transaction,
): Transaction {
  const { listItem } = state.schema.nodes;
  let lifted = false;
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;
      let listDepth = rootListDepth + 3;
      while (listDepth > rootListDepth + 2) {
        const start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        const end = tr.doc.resolve(
          tr.mapping.map(pos + node.textContent.length),
        );
        const sel = new TextSelection(start, end);
        tr = liftListItem(state, sel, tr);
      }
    }
  });
  return tr;
}

// Find the nearest ancestor list depth
export function ancestorListDepth(pos: ResolvedPos, nodes): number | undefined {
  const { bulletList, orderedList } = nodes;
  const closest = findParentNodeOfTypeClosestToPos(pos, [
    orderedList,
    bulletList,
  ]);
  return closest ? closest.depth : undefined;
}

// The function will lift paragraphs in selection out to level 1 below root list.
export function liftSelectionList(
  state: EditorState,
  tr: Transaction,
): Transaction {
  const { $from, $to } = state.selection;
  const { paragraph } = state.schema.nodes;
  const listCol: any[] = [];

  const from = $from.before(ancestorListDepth($from, state.schema.nodes));
  const to = $to.after(ancestorListDepth($to, state.schema.nodes));

  tr.doc.nodesBetween(from, to - 2, (node, pos) => {
    if (node && node.type === paragraph) {
      listCol.push({ node, pos });
    }
  });
  for (let i = listCol.length - 1; i >= 0; i--) {
    const paragraph = listCol[i];
    const start = tr.doc.resolve(tr.mapping.map(paragraph.pos));
    if (start.depth > 0) {
      let end;
      if (paragraph.node.textContent && paragraph.node.textContent.length > 0) {
        end = tr.doc.resolve(
          tr.mapping.map(paragraph.pos + paragraph.node.textContent.length),
        );
      } else {
        end = tr.doc.resolve(tr.mapping.map(paragraph.pos + 1));
      }
      const range = start.blockRange(end);
      if (range) {
        tr.lift(range, getListLiftTarget(state.schema, start));
      }
    }
  }
  return tr;
}
