import { commonStyle } from '.';
import { Style, Attrs } from './interfaces';
import { serializeStyle, createTag } from './util';

export type TableData = {
  text?: string | null;
  style?: Style;
  attrs?: Attrs;
};

// Tables override font size, weight and other stuff, thus we reset it here with commonStyle
export const commonTableStyle = {
  ...commonStyle,
  margin: '0px',
  padding: '0px',
  'border-spacing': '0px',
  width: '100%',
};

export const createTableAttrs = (tableStyle: Style = {}) => ({
  cellspacing: 0,
  cellpadding: 0,
  border: 0,
  style: serializeStyle({
    ...commonTableStyle,
    // Allow overriding any tableStyle, via tableStyle param
    ...tableStyle,
  }),
});

export const tableDataMapper = ({ style, text, attrs }: TableData) => {
  const css = style ? serializeStyle(style) : '';
  return createTag('td', { style: css, ...attrs }, text ? text : '');
};

export const tableRowMapper = (tableRow: TableData[]) => {
  const tableColumns = tableRow.map(tableDataMapper);
  return createTag('tr', {}, tableColumns.join(''));
};

export const createTable = (
  tableData: TableData[][],
  tableStyle: Style = {},
  tableAttrs: Attrs = {},
): string => {
  const attrs = { ...createTableAttrs(tableStyle), ...tableAttrs };
  const tableRows = tableData.map(tableRowMapper).join('');
  return createTag('table', attrs, tableRows);
};
