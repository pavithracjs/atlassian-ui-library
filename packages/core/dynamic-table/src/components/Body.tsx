import * as React from 'react';
import TableRow from './TableRow';
import withSortedPageRows, {
  WithSortedPageRowsProps,
} from '../hoc/withSortedPageRows';
import { HeadType, RowType } from '../types';

interface Props extends WithSortedPageRowsProps {
  head?: HeadType;
  isFixedSize: boolean;
  onBodyRender?: (pageRows: Array<RowType>) => void;
}

class Body extends React.Component<Props, {}> {
  render() {
    const { pageRows, head, isFixedSize, onBodyRender } = this.props;

    onBodyRender && onBodyRender(pageRows);

    return (
      <tbody>
        {pageRows.map((row, rowIndex) => (
          <TableRow
            head={head}
            isFixedSize={isFixedSize}
            key={rowIndex} // eslint-disable-line react/no-array-index-key
            row={row}
          />
        ))}
      </tbody>
    );
  }
}

export default withSortedPageRows<Props>(Body);
