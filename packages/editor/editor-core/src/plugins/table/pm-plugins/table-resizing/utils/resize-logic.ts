import { ColumnState, getFreeSpace } from './column-state';
import { ResizeState, getTotalWidth, bulkColumnsResize } from './resize-state';

export const growColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
  selectedColumns: number[] = [],
): ResizeState => {
  // can't grow the last column
  if (!state.cols[colIndex + 1]) {
    return state;
  }
  // take space from columns to the right (if there're any)
  const isBulkResize = selectedColumns.length;
  const newAmount = isBulkResize ? selectedColumns.length * amount : amount;
  const res = moveSpaceFrom(
    state,
    newAmount,
    colIndex + 1,
    colIndex,
    selectedColumns,
  );
  const remaining = newAmount - res.amount;
  let newState = res.state;
  console.log({ newAmount, res: res.amount, remaining });
  if (remaining > 0) {
    newState = stackSpace(newState, colIndex, remaining, selectedColumns).state;
  }

  return newState;
};

export const shrinkColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
  selectedColumns: number[] = [],
): ResizeState => {
  // try to shrink dragging column by giving from the column to the right first
  const res = moveSpaceFrom(
    state,
    -amount,
    colIndex,
    colIndex + 1,
    selectedColumns,
  );
  let newState = res.state;

  const isOverflownTable = getTotalWidth(newState) > newState.maxSize;
  const isLastColumn = !newState.cols[colIndex + 1];
  // stop resizing the last column once table is not overflown
  if (isLastColumn && !isOverflownTable) {
    return newState;
  }

  const remaining = amount + res.amount;
  if (remaining < 0) {
    newState = stackSpace(newState, colIndex + 1, remaining, selectedColumns)
      .state;
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
  while (remaining > 0) {
    // filter candidates only with free space
    const candidates = state.cols.filter(column => {
      return getFreeSpace(column) && ignoreCols.indexOf(column.index) === -1;
    });
    if (candidates.length === 0) {
      break;
    }
    const requestedResize = Math.floor(remaining / candidates.length);
    if (requestedResize === 0) {
      break;
    }

    candidates.forEach(candidate => {
      let newWidth = candidate.width - requestedResize;
      if (newWidth < candidate.minWidth) {
        // If the new requested width is less than our min
        // Calc what width we didn't use, we'll try extract that
        // from other cols.
        const remainder = candidate.minWidth - newWidth;
        newWidth = candidate.minWidth;
        remaining = remaining - requestedResize + remainder;
      } else {
        remaining -= requestedResize;
      }

      state = {
        ...state,
        cols: [
          ...state.cols.slice(0, candidate.index),
          { ...candidate, width: newWidth },
          ...state.cols.slice(candidate.index + 1),
        ],
      };
    });
  }

  return state;
}

enum ColType {
  SOURCE = 'src',
  DEST = 'dest',
}

function moveSpaceFrom(
  state: ResizeState,
  amount: number,
  sourceIndex: number,
  destinationIndex: number,
  selectedColumns: number[],
): { state: ResizeState; amount: number } {
  let destCols = [destinationIndex];
  if (selectedColumns.length) {
    // if the column we want to take space away is within selected columns, move it outside
    if (selectedColumns.indexOf(sourceIndex) > -1) {
      sourceIndex = selectedColumns[selectedColumns.length - 1] + 1;
    }
    destCols = selectedColumns;
  }

  // if taking more than source column's free space, only take that much
  if (state.cols[sourceIndex]) {
    const freeSpace = getFreeSpace(state.cols[sourceIndex]);
    if (amountFor(ColType.DEST)(amount) > freeSpace) {
      amount = amount > 0 ? freeSpace : -freeSpace;
    }
  }

  // when resizing last col to the left
  // const destCol = state.cols[destinationIndex];
  // if (!destCol && amountFor(ColType.SOURCE)(amount) < 0) {
  //   // non-zero-sum game, ensure that we're not removing more than the total table width either
  //   const totalWidth = getTotalWidth(state);
  //   if (
  //     totalWidth -
  //       srcCol.width +
  //       widthFor(ColType.SOURCE)(amount, srcCol, destCol) <
  //     state.maxSize
  //   ) {
  //     // would shrink table below max width, stop it
  //     amount = state.maxSize - (totalWidth - srcCol.width) - srcCol.width - 1;
  //   }
  // }

  const cols = state.cols.map(col => {
    // column where we take space from
    // when bulk resizing, need to take width * multiplier space (for each column)
    if (col.index === sourceIndex) {
      return {
        ...col,
        width: col.width + amountFor(ColType.SOURCE)(amount),
      };
    }
    // columns where we add space to
    else if (destCols.indexOf(col.index) > -1) {
      return {
        ...col,
        width:
          col.width +
          amountFor(ColType.DEST)(amount) / (selectedColumns.length || 1),
      };
    }

    return col;
  });

  return { state: { ...state, cols }, amount };
}

function stackSpace(
  state: ResizeState,
  destIdx: number,
  amount: number,
  selectedColumns: number[],
): { state: ResizeState; remaining: number } {
  let candidates = getCandidates(state, destIdx, amount);
  candidates = candidates.filter(
    col => selectedColumns.indexOf(col.index) === -1,
  );

  while (candidates.length && amount) {
    // search for most (or least) free space in candidates
    let candidateIdx = findNextFreeColumn(candidates, amount);
    if (candidateIdx === -1) {
      // stack to the right -> growing the dragging column and go overflow
      if (amount > 0) {
        const newAmount = Math.floor(amount / (selectedColumns.length || 1));
        return {
          state: {
            ...state,
            cols: state.cols.map(col => {
              if (
                selectedColumns.indexOf(col.index) > -1 ||
                col.index === destIdx
              ) {
                return {
                  ...col,
                  width: col.width + newAmount,
                };
              }
              return col;
            }),
          },
          remaining: newAmount,
        };
      }

      // stacking to the left, if no free space remains
      break;
    }

    const column = candidates.find(col => col.index === candidateIdx);
    if (!column || getFreeSpace(column) <= 0) {
      // no more columns with free space remain
      break;
    }

    const res = moveSpaceFrom(
      state,
      amount,
      column.index,
      destIdx,
      selectedColumns,
    );
    state = res.state;
    amount -= res.amount;

    candidates = candidates.filter(col => col.index !== candidateIdx);
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
