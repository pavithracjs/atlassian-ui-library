import { Mark } from 'prosemirror-model';
import { Style } from './interfaces';
import { markSerializers } from './serializers';
export * from './table-util';

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

    const attrValue = escapeHtmlString(String(value)).replace(/"/g, "'");

    attrsList.push(`${key}="${attrValue}"`);
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

export const buildOutlookConditional = (
  ifOutlook: string,
  ifNotOutlook: string,
) =>
  `<!--[if mso]>${ifOutlook}<span style=\\"mso-hide:all; overflow:hidden; display:none; visibility:hidden; width:0px; height:0px;\\"><![endif]-->${ifNotOutlook}<!--[if mso]></span><![endif]-->`;

export const escapeHtmlString = (content: string | undefined | null) => {
  if (!content) return '';

  // We need to first replace with temp placeholders to avoid recursion, as buildOutlookConditional() returns html, too!
  const escapedContent = content
    .replace(/</g, '$TMP_LT$')
    .replace(/>/g, '$TMP_GT$')
    .replace(/\$TMP_LT\$/g, buildOutlookConditional('≺', '&lt;'))
    .replace(/\$TMP_GT\$/g, buildOutlookConditional('≻', '&gt;'));

  return escapedContent;
};
