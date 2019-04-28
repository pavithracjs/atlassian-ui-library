import * as React from 'react';
import {
  DragDropContext,
  Droppable,
  DropResult,
  DragStart,
} from 'react-beautiful-dnd';
import TableRow from './TableRow';
import {
  HeadType,
  RowType,
  RankStart,
  RankEnd,
  RankEndLocation,
} from '../../types';
import withSortedPageRows, {
  WithSortedPageRowsProps,
} from '../../hoc/withSortedPageRows';

export interface Props extends WithSortedPageRowsProps {
  onRankStart: (rankStart: RankStart) => void;
  onRankEnd: (rankEnd: RankEnd) => void;
  isFixedSize: boolean;
  isRanking: boolean;
  isRankingDisabled: boolean;
  head: HeadType | null;
}

// computes destination of ranking
// - if drag was cancelled returns undefined
// - if drag was finished, returns new position and after/before key
const computeRankDestination = (
  result: DropResult,
  pageRows: RowType[],
): RankEndLocation | undefined => {
  const {
    source: { index: sourceIndex },
    destination,
  } = result;
  if (destination) {
    const { index } = destination;

    const keyIndex = index < sourceIndex ? index - 1 : index;
    const afterKey = keyIndex !== -1 ? pageRows[keyIndex].key : undefined;
    const beforeIndex = keyIndex === -1 ? 0 : keyIndex + 1;
    const beforeKey =
      beforeIndex < pageRows.length ? pageRows[beforeIndex].key : undefined;

    return {
      index,
      afterKey,
      beforeKey,
    };
  }

  return undefined;
};

export class RankableBody extends React.Component<Props, {}> {
  onBeforeDragStart = (dragStart: DragStart) => {
    const {
      draggableId: key,
      source: { index },
    } = dragStart;
    const rankStartProps = {
      index,
      key,
    };

    this.props.onRankStart(rankStartProps);
  };

  onDragEnd = (result: DropResult) => {
    const { pageRows, onRankEnd } = this.props;
    const {
      draggableId: sourceKey,
      source: { index: sourceIndex },
    } = result;
    const destination = computeRankDestination(result, pageRows);

    const rankEndProps = {
      sourceIndex,
      sourceKey,
      destination,
    } as RankEnd;

    onRankEnd(rankEndProps);
  };

  render() {
    const {
      pageRows,
      head,
      isFixedSize,
      isRanking,
      isRankingDisabled,
    } = this.props;

    return (
      <DragDropContext
        onBeforeDragStart={this.onBeforeDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="dynamic-table-droppable"
          isDropDisabled={isRankingDisabled}
        >
          {provided => (
            <tbody ref={provided.innerRef} {...provided.droppableProps}>
              {pageRows.map((row, rowIndex) => (
                <TableRow
                  head={head}
                  isRanking={isRanking}
                  isFixedSize={isFixedSize}
                  key={row.key}
                  rowIndex={rowIndex}
                  row={row}
                  isRankingDisabled={isRankingDisabled}
                />
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default withSortedPageRows<Props>(RankableBody);
