import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export const listItemStyles = `
li.listItem > p {
  margin-bottom: 0px;
  padding-top: 0px;
}
`;

const style = serializeStyle({
  'margin-top': '4px',
});

export default function listItem({ text }: NodeSerializerOpts) {
  return createTag('li', { class: 'listItem', style }, text);
}
