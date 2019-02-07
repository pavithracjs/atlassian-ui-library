import { Transaction } from 'prosemirror-state';
import { Mark } from 'prosemirror-model';
import { findParentNodeOfType } from 'prosemirror-utils';
import { isEmptyNode } from '../../../utils/document';

export const applyDefaultMarks = (tr: Transaction) => {
  if (!tr.selection.empty) {
    return tr;
  }

  const { schema } = tr.doc.type;
  const { tableHeader, tableCell } = schema.nodes;
  const cell = findParentNodeOfType([tableHeader, tableCell])(tr.selection);

  if (
    !cell ||
    !cell.node.attrs.defaultMarks ||
    !cell.node.attrs.defaultMarks.length ||
    !isEmptyNode(cell.node)
  ) {
    return tr;
  }

  const marks: Mark[] = [];

  cell.node.attrs.defaultMarks.forEach(mark => {
    if (schema.marks[mark]) {
      marks.push(schema.marks[mark].create());
    }
  });

  if (marks.length) {
    return tr.setStoredMarks(marks);
  }

  return tr;
};
