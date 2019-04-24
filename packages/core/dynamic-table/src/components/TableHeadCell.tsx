import * as React from 'react';
import { HeadCell } from '../styled/TableHead';
import { SortOrderType } from '../types';

export interface Props {
  sortKey?: string;
  isSortable?: boolean;
  sortOrder?: SortOrderType;
  isFixedSize?: boolean;
  innerRef?: (element?: React.ReactElement<any>) => void;
  inlineStyles?: {};
  content: React.ReactNode;
  onClick?: Function;
}

class TableHeadCell extends React.Component<Props, {}> {
  static defaultProps = {
    innerRef: () => {},
    inlineStyles: {},
  };

  render() {
    const { content, inlineStyles, ...restCellProps } = this.props;

    return (
      <HeadCell {...restCellProps} style={inlineStyles}>
        <span>{content}</span>
      </HeadCell>
    );
  }
}

export default TableHeadCell;
