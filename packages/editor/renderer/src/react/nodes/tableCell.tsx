import * as React from 'react';
import {
  hexToRgba,
  akEditorTableCellBackgroundOpacity,
} from '@atlaskit/editor-common';
import { CellAttributes } from '@atlaskit/adf-schema';

type Props = CellAttributes & { children?: React.ReactNode };

// tslint:disable-next-line:variable-name
const TableCell = (props: Props) => {
  const style: any = {};
  if (props.background) {
    // we do this when doing toDOM, so do here as well
    const color = hexToRgba(
      props.background,
      akEditorTableCellBackgroundOpacity,
    );
    style['background-color'] = color;
  }

  const attrs: any = {};
  if (props.colwidth) {
    attrs['data-colwidth'] = props.colwidth.join(',');
  }

  return (
    <td
      style={style}
      rowSpan={props.rowspan}
      colSpan={props.colspan}
      {...attrs}
    >
      {props.children}
    </td>
  );
};

export default TableCell;
