import { Transaction, Selection, TextSelection } from 'prosemirror-state';
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

  const marks: Mark[] = cell.node.attrs.defaultMarks
    .map((mark: Mark) => {
      const { type, attrs } = mark;
      if (typeof type.create === 'function') {
        return type.create(attrs);
      } else if (typeof type === 'string') {
        return schema.marks[type].create(attrs);
      }

      return null;
    })
    .filter(Boolean);

  if (marks.length) {
    return tr.setStoredMarks(marks);
  }

  return tr;
};

export const saveDefaultMarksInCellNode = (tr: Transaction) => {
  const { schema } = tr.doc.type;
  const { tableHeader, tableCell } = schema.nodes;
  const cell = findParentNodeOfType([tableHeader, tableCell])(tr.selection);

  if (!cell || !isEmptyNode(cell.node)) {
    return tr;
  }

  const cellNode = cell.node;
  const newCell = cellNode.type.createChecked(
    {
      ...cellNode,
      defaultMarks: tr.storedMarks,
    },
    cellNode.content,
    cellNode.marks,
  );

  tr.replaceWith(cell.pos, cell.pos + cell.node.nodeSize, newCell);

  const selFrom = Selection.findFrom(tr.selection.$anchor, 1);
  const selTo = Selection.findFrom(
    tr.doc.resolve(cell.pos + cell.node.nodeSize),
    -1,
    true,
  );

  if (selFrom && selTo) {
    return tr.setSelection(new TextSelection(selFrom.$from, selTo.$to));
  }

  return tr;
};
