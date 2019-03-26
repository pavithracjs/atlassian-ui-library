import { N50 } from '@atlaskit/adf-schema';
import { createTag, serializeStyle, commonTableStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  ...commonTableStyle,
  border: `1px solid ${N50}`,
  'border-collapse': 'collapse',
  margin: '20px 8px',
  width: 'auto',
});

export default function table({ attrs, text }: NodeSerializerOpts) {
  let colgroup = '';

  if (attrs.columnWidths) {
    const colTags = attrs.columnWidths.map((colwidth: string | number) => {
      const style = colwidth ? `width: ${colwidth}px` : undefined;
      return createTag('col', { style });
    });

    colgroup = createTag('colgroup', undefined, colTags.join(''));
  }

  return createTag('table', { style: css }, colgroup + text);
}
