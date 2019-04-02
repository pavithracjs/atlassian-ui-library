import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';
import { N30, N50, N800 } from '@atlaskit/adf-schema';

const innerStyle = serializeStyle({
  'background-color': N30,
  border: `3px solid ${N30}`,
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
  color: N800,
});

const outerStyle = serializeStyle({
  border: `1px solid ${N50}`,
  'border-style': 'dashed',
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
  display: 'inline-block',
});

export default function inlineExtension({ attrs }: NodeSerializerOpts) {
  const inner = createTag(
    'span',
    { style: innerStyle },
    `&nbsp;${attrs.extensionKey}&nbsp;`,
  );
  return createTag('span', { style: outerStyle }, inner);
}
