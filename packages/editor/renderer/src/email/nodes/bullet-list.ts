import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'list-style-type': 'disc',
  'margin-top': '12px',
  'margin-bottom': '12px',
});

export default function bulletList({ text }: NodeSerializerOpts) {
  return createTag('ul', { style: css }, text);
}
