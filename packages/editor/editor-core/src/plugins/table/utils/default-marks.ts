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
    const { type } = mark;
    if (schema.marks[type]) {
      marks.push(schema.marks[type].create());
    }
  });

  if (marks.length) {
    return tr.setStoredMarks(marks);
  }

  return tr;
};

function arrayDiffFrom(a1, a2, toEqual) {
  const result = [];
  const notInArr2 = [];
  (a1 || []).forEach(arrElement => {
    const element = a2.filter(x => toEqual(x, arrElement));

    if (!element.length) {
      result.push(arrElement);
    } else {
      notInArr2.push(arrElement);
    }
  });

  return result;
}

function symmetricDifference(arr1, arr2, toEqual = (x, y) => x === y) {
  const resultAtoB = arrayDiffFrom(arr1, arr2, toEqual);
  const resultBtoA = arrayDiffFrom(arr2, arr1, toEqual);

  return [].concat(resultAtoB, resultBtoA);
}

function blas(arr1, arr2) {
  return arr1
    .filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)));
}

export const toggleMarksOnDefaultMarks = (tr: Transaction) => {
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
  const storedMarks = tr.storedMarks || [];
  const defaultMarks = (cell.node.attrs.defaultMarks || []).map(x =>
    schema.marks[x.type].create(),
  );

  const difference = arrayDiffFrom(
    defaultMarks,
    storedMarks,
    (x, y) => x.type === y.type,
  );

  console.log(storedMarks);
  console.log(defaultMarks);
  console.log(difference);
};
