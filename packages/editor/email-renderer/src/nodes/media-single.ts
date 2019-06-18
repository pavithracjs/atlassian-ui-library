import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

export default function mediaSingle({ attrs, text }: NodeSerializerOpts) {
  const fullWidthStyle = serializeStyle({
    width: '100%',
  });

  const style = attrs.layout === 'full-width' ? fullWidthStyle : '';

  return createTag('div', { style }, text);
}
