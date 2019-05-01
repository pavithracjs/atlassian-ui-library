import * as React from 'react';
import { Omit } from '@atlaskit/type-helpers';
import { ASC } from '../internal/constants';
import { getPageRows, validateSortKey } from '../internal/helpers';
import { HeadType, RowCellType, RowType, SortOrderType } from '../types';

// sort all rows based on sort key and order
const getSortedRows = (
  head?: HeadType,
  rows?: Array<RowType>,
  sortKey?: string,
  sortOrder?: SortOrderType,
) => {
  if (!sortKey || !head) {
    return rows;
  }
  if (!rows) {
    return [];
  }

  // return value which will be used for sorting
  const getSortingCellValue = (cells: Array<RowCellType>) =>
    cells.reduce(
      (result: {} | null | undefined, cell, index) =>
        result ||
        (head &&
          head.cells[index].key === sortKey &&
          (cell.key !== undefined ? cell.key : cell.content)),
      null,
    );

  // Reorder rows in table based on sorting cell value
  // Algorithm will sort numerics or strings, but not both
  return rows.slice().sort((a, b) => {
    const valA = getSortingCellValue(a.cells);
    const valB = getSortingCellValue(b.cells);

    // modifier used for sorting type (ascending or descending)
    const modifier = sortOrder === ASC ? 1 : -1;
    if (typeof valA !== typeof valB) {
      // numbers are always grouped higher in the sort
      if (typeof valA === 'number') {
        return -1;
      }
      if (typeof valB === 'number') {
        return 1;
      }
      // strings are grouped next
      if (typeof valA === 'string') {
        return -1;
      }
      if (typeof valB === 'string') {
        return 1;
      }
    }

    // Sort strings using localeCompare
    if (typeof valA === 'string' && typeof valB === 'string') {
      return (
        modifier *
        valA.localeCompare(valB, undefined, {
          sensitivity: 'accent',
          numeric: true,
        })
      );
    }

    if ((!valA && valA !== 0) || valA < valB) {
      return -modifier;
    }
    if ((!valB && valB !== 0) || valA > valB) {
      return modifier;
    }
    if (valA === valB) {
      return 0;
    }
    return 1;
  });
};

export interface Props {
  head?: HeadType;
  page?: number;
  rows?: Array<RowType>;
  rowsPerPage?: number;
  sortKey?: string;
  sortOrder?: SortOrderType;
}

export interface WithSortedPageRowsProps {
  pageRows: Array<RowType>;
}

// get one page of data in table, sorting all rows previously
export default function withSortedPageRows<
  WrappedComponentProps extends WithSortedPageRowsProps & Props
>(WrappedComponent: React.ComponentType<WrappedComponentProps>) {
  return class WithSortedPageRows extends React.Component<
    Omit<WrappedComponentProps & Props, 'pageRows'>
  > {
    componentWillMount() {
      validateSortKey(this.props.sortKey, this.props.head);
    }

    componentWillReceiveProps(
      nextProps: Omit<WrappedComponentProps & Props, 'pageRows'>,
    ) {
      if (
        this.props.sortKey !== nextProps.sortKey ||
        this.props.head !== nextProps.head
      ) {
        validateSortKey(nextProps.sortKey, nextProps.head);
      }
    }

    render() {
      const {
        rows,
        head,
        sortKey,
        sortOrder,
        rowsPerPage,
        page,
        // @ts-ignore - Rest types may only be created from object types
        ...restProps
      } = this.props;

      const sortedRows = getSortedRows(head, rows, sortKey, sortOrder) || [];
      const pageRows = getPageRows(sortedRows, page, rowsPerPage);

      return (
        <WrappedComponent pageRows={pageRows} head={head} {...restProps} />
      );
    }
  };
}
