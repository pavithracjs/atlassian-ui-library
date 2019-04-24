import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { RankableTableBodyRow } from '../../styled/rankable/TableRow';
import { HeadCellType, HeadType, RowType } from '../../types';
import withDimensions, { WithDimensionsProps } from '../../hoc/withDimensions';
import TableCell from './TableCell';
import { inlineStylesIfRanking } from '../../internal/helpers';

interface Props extends WithDimensionsProps {
  head: HeadType | null;
  isFixedSize: boolean;
  row: RowType;
  isRanking: boolean;
  rowIndex: number;
  isRankingDisabled: boolean;
}

export class RankableTableRow extends React.Component<Props, {}> {
  innerRef = (innerRefFn: Function) => (ref: HTMLElement) => {
    innerRefFn(ref);
    this.props.innerRef(ref);
  };

  render() {
    const {
      row,
      head,
      isFixedSize,
      isRanking,
      refWidth,
      rowIndex,
      isRankingDisabled,
    } = this.props;
    const { cells, key, ...restRowProps } = row;
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

    if (typeof key !== 'string' && !isRankingDisabled) {
      throw new Error(
        'dynamic-table: ranking is not possible because table row does not have a key. Add the key to the row or disable ranking.',
      );
    }

    return (
      <Draggable
        draggableId={key || `${rowIndex}`}
        index={rowIndex}
        isDragDisabled={isRankingDisabled}
      >
        {(provided, snapshot) => (
          <RankableTableBodyRow
            {...restRowProps}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            innerRef={this.innerRef(provided.innerRef)}
            style={{ ...provided.draggableProps.style, ...inlineStyles }}
            isRanking={isRanking}
            isRankingItem={snapshot.isDragging}
          >
            {cells.map((cell, cellIndex) => {
              const headCell = (head || { cells: [] }).cells[
                cellIndex
              ] as HeadCellType;
              return (
                <TableCell
                  head={headCell}
                  cell={cell}
                  isRanking={isRanking}
                  key={cellIndex} // eslint-disable-line react/no-array-index-key
                  isFixedSize={isFixedSize}
                />
              );
            })}
          </RankableTableBodyRow>
        )}
      </Draggable>
    );
  }
}

export default withDimensions<Props>(RankableTableRow);
