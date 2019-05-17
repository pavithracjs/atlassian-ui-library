import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'text-decoration': 'line-through',
});

export default function strike({ text }: MarkSerializerOpts) {
  return createTag('span', { style: css }, text);
}
