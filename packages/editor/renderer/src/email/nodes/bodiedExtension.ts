import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';
import { N20 } from '@atlaskit/adf-schema';

const style = serializeStyle({
  'background-color': N20,
  border: `3px solid ${N20}`,
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
  'margin-top': '10px',
});

export default function bodiedExtension({ attrs }: NodeSerializerOpts) {
  return createTag('div', { style }, `[ ${attrs.extensionKey} ]`);
}
