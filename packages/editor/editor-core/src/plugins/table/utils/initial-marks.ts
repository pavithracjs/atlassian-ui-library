import { Transaction } from 'prosemirror-state';
import { Mark } from 'prosemirror-model';
import { findParentNodeOfType } from 'prosemirror-utils';

export const applyInitialMarks = (tr: Transaction) => {
  if (!tr.selection.empty) {
    return tr;
  }

  const { schema } = tr.doc.type;
  const { tableHeader, tableCell } = schema.nodes;
  const cell = findParentNodeOfType([tableHeader, tableCell])(tr.selection);
  if (
    !cell ||
    !cell.node.attrs.initialMarks ||
    !cell.node.attrs.initialMarks.length
  ) {
    return tr;
  }
  const marks: Mark[] = [];
  cell.node.attrs.initialMarks.forEach(mark => {
    if (schema.marks[mark]) {
      marks.push(schema.marks[mark].create());
    }
  });
  if (marks.length) {
    return tr.setStoredMarks(marks);
  }

  return tr;
};
