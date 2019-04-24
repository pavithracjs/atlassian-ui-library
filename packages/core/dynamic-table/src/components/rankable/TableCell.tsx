import * as React from 'react';
import { RankableTableBodyCell } from '../../styled/rankable/TableCell';
import { HeadCellType, RowCellType } from '../../types';
import withDimensions, { WithDimensionsProps } from '../../hoc/withDimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';

interface Props extends WithDimensionsProps {
  head: HeadCellType | void;
  cell: RowCellType;
  isFixedSize: boolean;
  isRanking: boolean;
}

const stopPropagation = (e: any) => e.stopPropagation();

export class RankableTableCell extends React.Component<Props, {}> {
  render() {
    const {
      cell,
      head,
      isFixedSize,
      isRanking,
      innerRef,
      refWidth,
    } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width }: any = head || {};
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        style={inlineStyles}
        innerRef={innerRef}
        onKeyDown={stopPropagation}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
}

export default withDimensions<Props>(RankableTableCell);
