import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('ul')} {
  list-style-type: disc;
  margin-top: 12px;
  margin-bottom: 12px;
}
.${createClassName('li')} > .${createClassName('ul')} {
  margin-top: 0px;
  margin-bottom: 0px;
}
`;

export default function bulletList({ text }: NodeSerializerOpts) {
  return createTag('ul', { class: createClassName('ul') }, text);
}
