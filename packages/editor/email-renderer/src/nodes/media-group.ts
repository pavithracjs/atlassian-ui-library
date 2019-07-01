import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';

export default function mediaGroup({ attrs, text }: NodeSerializerOpts) {
  const fullWidthStyle = serializeStyle({
    width: '100%',
  });

  const style = attrs.layout === 'full-width' ? fullWidthStyle : '';

  return createTag('div', { style }, text);
}
