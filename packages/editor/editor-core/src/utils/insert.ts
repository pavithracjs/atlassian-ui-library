import {
  isNodeSelection,
  canInsert,
  safeInsert as pmuSafeInsert,
} from 'prosemirror-utils';
import { Transaction } from 'prosemirror-state';
import { Node, Fragment } from 'prosemirror-model';
import { GapCursorSelection, Side } from '../plugins/gap-cursor';
import { ReplaceStep } from 'prosemirror-transform';
import { isEmptyParagraph } from './document';

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

  // Clear existing selection
  if (!tr.selection.empty || isNodeSelection(tr.selection)) {
    tr.deleteSelection();
  }

  const hasPosition = typeof position === 'number';
  const { $from } = tr.selection;
  const $insertPos = hasPosition
    ? tr.doc.resolve(position!)
    : isNodeSelection(tr.selection)
    ? tr.doc.resolve($from.pos + 1)
    : $from;

  let lookDirection: 'before' | 'after';
  if ($insertPos.pos === $insertPos.end()) {
    lookDirection = 'after';
  } else if ($insertPos.pos === $insertPos.start()) {
    lookDirection = 'before';
  } else {
    // Insert by split
    return finaliseInsert(tr.insert($insertPos.pos, content), content.nodeSize);
  }

  // Replace empty paragraph
  if (isEmptyParagraph($insertPos.parent)) {
    return finaliseInsert(
      tr.replaceWith($insertPos.before(), $insertPos.after(), content),
      -1, // FIXME: This is a magic number
    );
  }

  let proposedPosition = $insertPos;
  while (proposedPosition.depth > 0) {
    // Insert at position (before or after target node)
    if (canInsert(proposedPosition, content)) {
      return finaliseInsert(
        tr.insert(proposedPosition.pos, content),
        content.nodeSize,
      );
    }

    // Special case for splitting on lists
    if (
      proposedPosition.parent.type === tr.doc.type.schema.nodes.orderedList ||
      proposedPosition.parent.type === tr.doc.type.schema.nodes.bulletList
    ) {
      return finaliseInsert(
        tr.insert(proposedPosition.pos, content),
        content.nodeSize,
      );
    }

    // Can not insert into current parent, step up one parent
    proposedPosition = tr.doc.resolve(proposedPosition[lookDirection]());
  }

  return finaliseInsert(
    tr.insert(proposedPosition.pos, content),
    content.nodeSize,
  );
};

const finaliseInsert = (tr: Transaction, nodeLength: number) => {
  const lastStep = tr.steps[tr.steps.length - 1] as ReplaceStep;
  const gapCursorPos = lastStep.to + lastStep.slice.openStart + nodeLength;
  return tr
    .setSelection(
      new GapCursorSelection(tr.doc.resolve(gapCursorPos), Side.RIGHT),
    )
    .scrollIntoView();
};
