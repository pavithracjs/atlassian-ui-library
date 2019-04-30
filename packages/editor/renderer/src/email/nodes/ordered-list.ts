import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'list-style-type': 'decimal',
  'margin-top': '12px',
  'margin-bottom': '12px',
});

export default function orderedList({ text }: NodeSerializerOpts) {
  return createTag('ol', { style: css }, text);
}
