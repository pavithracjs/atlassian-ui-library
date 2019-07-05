import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('ol')} {
  list-style-type: decimal;
  margin-top: 12px;
  margin-bottom: 12px;
}
.${createClassName('li')} > .${createClassName('ol')} {
  margin-top: 0px;
  margin-bottom: 0px;
}
`;

export default function orderedList({ text }: NodeSerializerOpts) {
  return createTag('ol', { class: createClassName('ol') }, text);
}
