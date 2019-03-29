import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';
import { N20 } from '@atlaskit/adf-schema';

const style = serializeStyle({
  'background-color': N20,
  border: `3px solid ${N20}`,
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
});

export default function inlineExtension({ attrs }: NodeSerializerOpts) {
  return createTag('span', { style }, `[ ${attrs.extensionKey} ]`);
}
