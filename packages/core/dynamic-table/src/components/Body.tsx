import TableRow from './TableRow';
import withSortedPageRows, {
  WithSortedPageRowsProps,
} from '../hoc/withSortedPageRows';
import { HeadType } from '../types';
import * as React from 'react';

interface Props extends WithSortedPageRowsProps {
  head?: HeadType;
  isFixedSize: boolean;
}

class Body extends React.Component<Props, {}> {
  render() {
    const { pageRows, head, isFixedSize } = this.props;

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
