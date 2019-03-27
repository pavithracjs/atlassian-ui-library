import { N20, N50, N200 } from '@atlaskit/adf-schema';
import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const style = serializeStyle({
  'background-color': N20,
  'background-clip': 'padding-box',
  border: `1px solid ${N50}`,
  'border-right-width': 0,
  'border-bottom-width': 0,
  height: '2.5em',
  padding: '6px 10px',
  'text-align': 'center',
  'vertical-align': 'top',
});
const pStyle = serializeStyle({
  margin: '0',
  'margin-bottom': '7px',
  padding: '0px',
  'padding-top': '7px',
  'mso-line-height-rule': 'exactly',
  'line-height': '24px',
  'font-size': '14px',
  color: N200,
});

export default function tableRow({ text, attrs }: NodeSerializerOpts) {
  let numberedColumn = '';
  if (attrs && attrs.isNumberColumnEnabled) {
    const paragraph = createTag('p', { style: pStyle }, attrs.index);
    numberedColumn = createTag('td', { style }, paragraph);
  }
  return createTag('tr', {}, numberedColumn + text);
}
