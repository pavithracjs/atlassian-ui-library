import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';
import { N30, N50, N800 } from '@atlaskit/adf-schema';

const innerStyle = serializeStyle({
  'background-color': N30,
  border: `10px solid ${N30}`,
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
  color: N800,
});

const outerStyle = serializeStyle({
  border: `1px solid ${N50}`,
  'margin-top': '10px',
  'border-radius': '3px',
  'border-style': 'dashed',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
});

export default function media({ attrs }: NodeSerializerOpts) {
  const inner = createTag(
    'div',
    { style: innerStyle },
    `&nbsp;&rtri;&nbsp;${attrs.type}:&nbsp;${attrs.collection}&nbsp;`,
  );
  return createTag('div', { style: outerStyle }, inner);
}
