import * as React from 'react';
import { CSSProperties } from 'react';
import { CellAttributes } from '@atlaskit/adf-schema';

type Props = CellAttributes & { children?: React.ReactNode };

const TableHeader = (props: Props) => {
  const style: CSSProperties = {};

  if (props.background) {
    style.backgroundColor = props.background;
  }

  const attrs: any = {};
  if (props.colwidth && Array.isArray(props.colwidth)) {
    attrs['data-colwidth'] = props.colwidth.join(',');
  }

  return (
    <th
      style={style}
      rowSpan={props.rowspan}
      colSpan={props.colspan}
      {...attrs}
    >
      {props.children}
    </th>
  );
};

export default TableHeader;
