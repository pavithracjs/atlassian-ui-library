import {
  Fragment,
  NodeRange,
  Slice,
  Schema,
  Node,
  NodeType,
} from 'prosemirror-model';
import {
  EditorState,
  Transaction,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import { getListLiftTarget } from './utils';
import { mapSlice, mapChildren } from '../../utils/slice';

function liftListItem(
  state: EditorState,
  selection: Selection,
  tr: Transaction,
): Transaction {
  let { $from, $to } = selection;
  const nodeType = state.schema.nodes.listItem;
  let range = $from.blockRange(
    $to,
    node =>
      !!node.childCount &&
      !!node.firstChild &&
      node.firstChild.type === nodeType,
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

// The function will list paragraphs in selection out to level 1 below root list.
export function liftSelectionList(
  state: EditorState,
  tr: Transaction,
): Transaction {
  const { from, to } = state.selection;
  const { paragraph } = state.schema.nodes;
  const listCol: any[] = [];
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === paragraph) {
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

const bullets = /^\s*([\*\-•])(\s*|$)/;
const numbers = /^\s*(\d)[\.\)](\s*|$)/;

const getListType = (
  node: Node,
  index: number,
  schema: Schema,
): [NodeType, number] | null => {
  if (!node.text) {
    console.warn('no text', node);
    return null;
  }

  const bulletMatch = node.text!.match(bullets);
  if (bulletMatch) {
    return [schema.nodes.bulletList, bulletMatch[0].length];
  }

  const numMatch = node.text!.match(numbers);
  if (
    numMatch &&
    numMatch.groups &&
    numMatch.groups[1] === (index + 1).toString()
  ) {
    return [schema.nodes.numberedList, numMatch[0].length];
  }

  return null;
};

const extractListFromParagaph = (node: Node, schema: Schema): Node => {
  const before: Array<Node> = [];
  const after: Array<Node> = [];

  const children: Array<Node> = [];
  let allMatched = true;
  let lastMatch: NodeType | null = null;

  node.content.forEach((child, offset, index) => {
    if (!child.isText || !child.text) {
      return;
    }

    const listMatch = getListType(child, index, schema);
    if (!listMatch) {
      // FIXME: only need to keep track when we have 2 mismatches
      if (lastMatch) {
        allMatched = false;
      }

      // TODO: use index better
      if (!children.length) {
        before.push(child);
      } else {
        after.push(child);
      }

      return;
    }

    const [listType, prefixLength] = listMatch;

    if (lastMatch && listType !== lastMatch) {
      // wasn't a list item, or differing types
      console.warn('no list or differing', listType, lastMatch);
      allMatched = false;
    }

    // convert to list item
    const newText = child.text.substr(prefixLength);
    const node = schema.nodes.listItem.createAndFill(
      undefined,
      schema.nodes.paragraph.createChecked(
        undefined,
        newText.length ? schema.text(newText) : undefined,
      ),
    );
    if (!node) {
      console.warn('no node from', child);
      return;
    }

    children.push(node);
    lastMatch = listType;
  });

  if (!allMatched || !lastMatch) {
    // some mismatching items, return unmodified
    console.warn('mismatch', children, lastMatch);
    return node;
  }

  // wrap all children in list
  console.log('children are', children);
  return lastMatch!.createChecked(undefined, children);
};

/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * @param slice
 * @param schema
 */
const splitIntoParagraphs = (fragment: Fragment, schema: Schema): Fragment => {
  const paragraphs = [];
  let curChildren: Array<Node> = [];
  let lastNode: Node | null = null;

  const { hardBreak, paragraph } = schema.nodes;

  fragment.forEach(node => {
    if (lastNode && lastNode.type === hardBreak && node.type === hardBreak) {
      // double hardbreak

      // backtrack a little; remove the trailing hardbreak we added last loop
      curChildren.pop();

      // create a new paragraph
      paragraphs.push(paragraph.createChecked(undefined, curChildren));
      curChildren = [];
      return;
    }

    // add to this paragraph
    curChildren.push(node);
    lastNode = node;
  });

  if (curChildren.length) {
    paragraphs.push(paragraph.createChecked(undefined, curChildren));
  }

  return Fragment.from(paragraphs);
};

export const splitParagraphs = (slice: Slice, schema: Schema): Slice => {
  // slice might just be a raw text string
  if (schema.nodes.paragraph.validContent(slice.content)) {
    return new Slice(
      splitIntoParagraphs(slice.content, schema),
      slice.openStart + 1,
      slice.openEnd + 1,
    );
  }

  return mapSlice(slice, (node, parent) => {
    if (node.type === schema.nodes.paragraph) {
      return splitIntoParagraphs(node.content, schema);
    }

    return node;
  });
};

// above will wrap everything in paragraphs for us
export const upgradeTextToLists = (slice: Slice, schema: Schema): Slice => {
  return mapSlice(slice, (node, parent) => {
    if (node.type === schema.nodes.paragraph) {
      return extractListFromParagaph(node, schema);
    }

    return node;
  });
};
