import * as React from 'react';
import withDimensions, { WithDimensionsProps } from '../../hoc/withDimensions';
import HeadCell, { Props as HeadCellProps } from '../TableHeadCell';
import { inlineStylesIfRanking } from '../../internal/helpers';

export type Props = {
  isRanking: boolean;
} & WithDimensionsProps &
  HeadCellProps;

class RankableTableHeadCell extends React.Component<Props, any> {
  render() {
    const {
      isRanking,
      refHeight,
      refWidth,
      innerRef,
      ...restProps
    } = this.props;
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);
    return (
      <HeadCell
        inlineStyles={inlineStyles}
        innerRef={innerRef}
        {...restProps}
      />
    );
  }
}

export default withDimensions<Props>(RankableTableHeadCell);
