import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'text-decoration': 'underline',
});

export default function strong({ text }: MarkSerializerOpts) {
  return createTag('span', { style: css }, text);
}
