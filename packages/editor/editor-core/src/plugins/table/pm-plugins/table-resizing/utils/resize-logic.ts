import { ColumnState, getFreeSpace } from './column-state';
import { ResizeState, getTotalWidth } from './resize-state';

export const growColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
): ResizeState => {
  // if last column
  if (!state.cols[colIndex + 1]) {
    return state;
  }

  let newState = { ...state };

  if (amount && state.cols[colIndex + 1]) {
    // if we couldn't naturally resize and we're growing this one,
    // directly shrink the adjacent one with the remaining width
    const res = moveSpaceFrom(state, colIndex + 1, colIndex, amount, false);

    newState = res.state;
    amount -= res.amount;
  }

  if (amount) {
    // if we still have remaining space, directly resize the column
    const oldCol = newState.cols[colIndex];

    if (amount < 0 && oldCol.width + amount < oldCol.minWidth) {
      amount = -(oldCol.width - oldCol.minWidth);
    }

    return {
      ...newState,
      cols: [
        ...newState.cols.slice(0, colIndex),
        { ...oldCol, width: oldCol.width + amount },
        ...newState.cols.slice(colIndex + 1),
      ],
    };
  }

  return newState;
};

export const shrinkColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
): ResizeState => {
  let canRedistribute =
    state.cols[colIndex + 1] || getTotalWidth(state) > state.maxSize;

  if (!canRedistribute) {
    return state;
  }

  // try to shrink this one by giving from the column to the right first
  const res = moveSpaceFrom(state, colIndex, colIndex + 1, -amount);

  let remaining = amount + res.amount;
  let newState = res.state;

  if (remaining < 0) {
    const stackResult = stackSpace(newState, colIndex, remaining);

    remaining += stackResult.remaining;
    newState = stackResult.state;
  }

  canRedistribute =
    newState.cols[colIndex + 1] || getTotalWidth(newState) > newState.maxSize;

  if (remaining && canRedistribute) {
    // direct resize
    const oldCol = newState.cols[colIndex];
    const oldNextCol = newState.cols[colIndex + 1];

    if (oldCol.width + remaining < oldCol.minWidth) {
      remaining = -(oldCol.width - oldCol.minWidth);
    }

    if (!oldNextCol) {
      const newSum = getTotalWidth(newState) + remaining;
      if (newSum < newState.maxSize) {
        remaining = newState.maxSize - getTotalWidth(newState) - 1;
      }
    }

    const newCol = { ...oldCol, width: oldCol.width + remaining };

    if (oldNextCol) {
      const nextCol = { ...oldNextCol, width: oldNextCol.width - remaining };

      return {
        ...newState,
        cols: [
          ...newState.cols.slice(0, colIndex),
          newCol,
          nextCol,
          ...newState.cols.slice(colIndex + 2),
        ],
      };
    }

    return {
      ...newState,
      cols: [
        ...newState.cols.slice(0, colIndex),
        newCol,
        ...newState.cols.slice(colIndex + 1),
      ],
    };
  }

  return newState;
};

export function reduceSpace(
  state: ResizeState,
  amount: number,
  ignoreCols: number[] = [],
): ResizeState {
  let remaining = amount;

  // keep trying to resolve resize request until we run out of free space,
  // or nothing to resize
  while (remaining) {
    // filter candidates only with free space
    const candidates = state.cols.filter(column => {
      return getFreeSpace(column) && ignoreCols.indexOf(column.index) === -1;
    });

    if (candidates.length === 0) {
      break;
    }

    const requestedResize = Math.ceil(remaining / candidates.length);
    if (requestedResize === 0) {
      break;
    }

    candidates.forEach(candidate => {
      let newWidth = candidate.width - requestedResize;
      let remainder = 0;
      if (newWidth < candidate.minWidth) {
        // If the new requested width is less than our min
        // Calc what width we didn't use, we'll try extract that
        // from other cols.
        remainder = candidate.minWidth - newWidth;
        newWidth = candidate.minWidth;
      }

      state = {
        ...state,
        cols: [
          ...state.cols.slice(0, candidate.index),
          { ...candidate, width: newWidth },
          ...state.cols.slice(candidate.index + 1),
        ],
      };

      remaining -= requestedResize + remainder;
    });
  }

  return state;
}

enum ColType {
  SOURCE = 'src',
  DEST = 'dest',
}

// TODO: should handle when destIdx:
// - is beyond the range, and then not give it back
function moveSpaceFrom(
  state: ResizeState,
  srcIdx: number,
  destIdx: number,
  amount: number,
  useFreeSpace: boolean = true,
): { state: ResizeState; amount: number } {
  const srcCol = state.cols[srcIdx];
  const destCol = state.cols[destIdx];

  if (useFreeSpace) {
    const freeSpace = getFreeSpace(srcCol);
    // if taking more than source column's free space, only take that much
    if (amountFor(ColType.DEST)(amount) > freeSpace) {
      amount = amount > 0 ? freeSpace : -freeSpace;
    }
  }

  // if the source column shrinks past its min size, don't give the space away
  if (
    amountFor(ColType.SOURCE)(amount) < 0 &&
    widthFor(ColType.SOURCE)(amount, srcCol, destCol) < srcCol.minWidth
  ) {
    amount = srcCol.width - srcCol.minWidth;
  }

  const newDest = destCol
    ? { ...destCol, width: widthFor(ColType.DEST)(amount, srcCol, destCol) }
    : undefined;
  if (!newDest && amountFor(ColType.SOURCE)(amount) < 0) {
    // non-zero-sum game, ensure that we're not removing more than the total table width either
    const totalWidth = getTotalWidth(state);
    if (
      totalWidth -
        srcCol.width +
        widthFor(ColType.SOURCE)(amount, srcCol, destCol) <
      state.maxSize
    ) {
      // would shrink table below max width, stop it
      amount = state.maxSize - (totalWidth - srcCol.width) - srcCol.width - 1;
    }
  }

  const newSrc = {
    ...srcCol,
    width: widthFor(ColType.SOURCE)(amount, srcCol, destCol),
  };

  const newCols = state.cols
    .map((existingCol, idx) =>
      idx === srcIdx ? newSrc : idx === destIdx ? newDest : existingCol,
    )
    .filter(Boolean) as ColumnState[];

  return { state: { ...state, cols: newCols }, amount };
}

function stackSpace(
  state: ResizeState,
  destIdx: number,
  amount: number,
): { state: ResizeState; remaining: number } {
  const candidates = getCandidates(state, destIdx, amount);

  while (candidates.length && amount) {
    // search for most (or least) free space in candidates
    const candidateIdx = findNextFreeColumn(candidates, amount);
    if (candidateIdx === -1) {
      // no free space remains
      break;
    }

    const column = candidates.splice(candidateIdx, 1)[0];
    if (getFreeSpace(column) <= 0) {
      // no more columns with free space remain
      break;
    }

    const res = moveSpaceFrom(state, column.index, destIdx, amount);
    state = res.state;
    amount -= res.amount;
  }

  return {
    state,
    remaining: amount,
  };
}

function findNextFreeColumn(columns: ColumnState[], amount: number): number {
  if (columns.length === 0) {
    return -1;
  }
  const direction = amount < 0 ? 'left' : 'right';
  if (direction === 'left') {
    columns = columns.slice().reverse();
  }

  let freeIndex = -1;
  columns.forEach(column => {
    if (getFreeSpace(column) && freeIndex === -1) {
      freeIndex = column.index;
    }
  });

  if (freeIndex === -1) {
    return -1;
  }

  return freeIndex;
}

function amountFor(colType: ColType): (amount: number) => number {
  return amount =>
    colType === ColType.SOURCE
      ? amount > 0
        ? -amount
        : amount
      : amount < 0
      ? -amount
      : amount;
}

function widthFor(
  colType: ColType,
): (amount: number, srcCol: ColumnState, destCol: ColumnState) => number {
  return (amount, srcCol, destCol) =>
    (colType === ColType.SOURCE ? srcCol : destCol).width +
    amountFor(colType)(amount);
}

function getCandidates(
  state: ResizeState,
  destIdx: number,
  amount: number,
): ColumnState[] {
  const candidates = state.cols;

  // only consider rows after the selected column in the direction of resize
  return amount < 0
    ? candidates.slice(0, destIdx)
    : candidates.slice(destIdx + 1);
}
