import { N50, calcTableColumnWidths } from '@atlaskit/adf-schema';
import { createTag } from '../create-tag';
import { NodeSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

const className = createClassName('tableNode');

export const styles = `
.${className} {
  border: 1px solid ${N50};
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}
.${className}-wrapper {
  margin-bottom: 20px;
  margin-top: 20px;
}
`;

export const numberedColumnWidth = 42;

export default function table({ text, node }: NodeSerializerOpts) {
  let columnWidths = calcTableColumnWidths(node);
  if (node.attrs && node.attrs.isNumberColumnEnabled) {
    columnWidths = [numberedColumnWidth, ...columnWidths];
  }

  const colTags = columnWidths.map((colwidth: string | number) => {
    const style = colwidth ? `width: ${colwidth}px` : undefined;
    return createTag('col', { style });
  });

  const colgroup = createTag('colgroup', undefined, colTags.join(''));

  const table = createTag('table', { class: className }, colgroup + text);
  return createTag('div', { class: `${className}-wrapper` }, table);
}
