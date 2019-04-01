import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

export default function mediaSingle({ attrs, text }: NodeSerializerOpts) {
  const style = serializeStyle({
    width: attrs.layout === 'full-width' ? '100%' : '400px',
  });

  return createTag('div', { style }, text);
}
