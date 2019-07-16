import {
  isNodeSelection,
  canInsert,
  safeInsert as pmuSafeInsert,
} from 'prosemirror-utils';
import { Transaction } from 'prosemirror-state';
import { Node, Fragment, ResolvedPos } from 'prosemirror-model';
import { GapCursorSelection, Side } from '../plugins/gap-cursor';

export type InsertableContent = Node | Fragment;

export const safeInsert = (
  content: InsertableContent,
  position?: number,
  tryToReplace?: boolean,
) => (tr: Transaction) => {
  // Temporary whitelist of currently implemented nodes
  const whitelist = ['rule'];
  if (content instanceof Fragment || !whitelist.includes(content.type.name)) {
    return pmuSafeInsert(content, position, tryToReplace)(tr);
  }

  // "Is the user selecting something"
  // Check for selection
  if (isNodeSelection(tr.selection) || !tr.selection.empty) {
    // NOT IMPLEMENTED
    return pmuSafeInsert(content, position, tryToReplace)(tr);
  }

  const hasPosition = typeof position === 'number';
  const { $from } = tr.selection;
  const $insertPos = hasPosition
    ? tr.doc.resolve(position!)
    : isNodeSelection(tr.selection)
    ? tr.doc.resolve($from.pos + 1)
    : $from;

  // Content is inline
  if (!content.isBlock) {
    // NOT IMPLEMENTED
    return pmuSafeInsert(content, position, tryToReplace)(tr);
  }

  console.log('new safeInsert:', content.type.name);

  let lookDirection: 'before' | 'after';
  if ($insertPos.pos === $insertPos.end()) {
    lookDirection = 'after';
  } else if ($insertPos.pos === $insertPos.start()) {
    lookDirection = 'before';
  } else {
    // Insert by split
    return finaliseInsert(tr.insert($insertPos.pos, content), $insertPos);
  }

  let proposedPosition = $insertPos;
  while (proposedPosition.depth > 0) {
    // Insert in place
    if (tr.selection.empty && canInsert(proposedPosition, content)) {
      return finaliseInsert(
        tr.insert(proposedPosition.pos, content),
        proposedPosition,
      );
    }

    // Can not insert into current parent, step up one parent
    proposedPosition = tr.doc.resolve(proposedPosition[lookDirection]());
  }
  return finaliseInsert(
    tr.insert(proposedPosition.pos, content),
    proposedPosition,
  );
};

const finaliseInsert = (tr: Transaction, insertPos: ResolvedPos) => {
  return tr
    .setSelection(new GapCursorSelection(insertPos, Side.RIGHT))
    .scrollIntoView();
};
