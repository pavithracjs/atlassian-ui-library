import { Mark } from 'prosemirror-model';
import { Style } from './interfaces';
import { markSerializers } from './serializers';
import { commonStyle } from '.';

export const createTag = (
  tagName: string,
  attrs?: { [key: string]: string | number | undefined },
  content?: string | null,
) => {
  const attrsList: string[] = [];

  Object.keys(attrs || {}).forEach(key => {
    const value = attrs![key];

    if (value === undefined) {
      return;
    }

    attrsList.push(`${key}="${String(value).replace(/"/g, "'")}"`);
  });

  const attrsSerialized = attrsList.length ? ` ${attrsList.join(' ')}` : '';

  return content
    ? `<${tagName}${attrsSerialized}>${content}</${tagName}>`
    : `<${tagName}${attrsSerialized}/>`;
};

export const serializeStyle = (style: Style): string => {
  return Object.keys(style).reduce((memo, key) => {
    if (style[key] === undefined) {
      return memo;
    }

    const value = String(style[key]).replace(/"/g, "'");
    return (memo += `${key}: ${value};`);
  }, '');
};

export const applyMarks = (marks: Mark[], text: string): string => {
  let output = text;
  for (const mark of marks) {
    // ignore marks with unknown type
    if (markSerializers[mark.type.name]) {
      output = markSerializers[mark.type.name]({ mark, text: output });
    }
  }

  return output;
};

type TableData = {
  text?: string | null;
  style: Style;
};

export const createTable = (
  tableData: TableData[][],
  tableStyle: Style = {},
): string => {
  // Tables override font size, weight and other stuff, thus we reset it here with commonStyle
  const attrs = {
    cellspacing: 0,
    cellpadding: 0,
    border: 0,
    style: serializeStyle({
      ...commonStyle,
      margin: '0px',
      padding: '0px',
      'border-spacing': '0px',
      width: '100%',
      // Allow overriding any tableStyle, via tableStyle param
      ...tableStyle,
    }),
  };

  const tableRows = tableData.map(tableRow => {
    const tableColumns = tableRow.map(({ style, text }) => {
      const css = serializeStyle(style);
      return createTag('td', { style: css }, text ? text : '');
    });
    return createTag('tr', {}, tableColumns.join(''));
  });

  return createTag('table', attrs, tableRows.join(''));
};
