import React, { KeyboardEvent } from 'react';
import { HeadCell } from '../styled/TableHead';
import { SortOrderType } from '../types';

export interface Props {
  sortKey?: string;
  isSortable?: boolean;
  sortOrder?: SortOrderType;
  isFixedSize?: boolean;
  innerRef?: (element?: React.ReactElement<any>) => void;
  inlineStyles?: {};
  content?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

class TableHeadCell extends React.Component<Props, {}> {
  static defaultProps = {
    innerRef: () => {},
    inlineStyles: {},
  };

  render() {
    const { content, inlineStyles, ...rest } = this.props;

    return (
      <HeadCell
        style={inlineStyles}
        {...rest}
        tabIndex={rest.isSortable ? 0 : undefined}
      >
        <span>{content}</span>
      </HeadCell>
    );
  }
}

export default TableHeadCell;
