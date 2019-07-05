import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';

const className = createClassName('taskList');

export const styles = `
.${className} {
  margin-top: 12px;
}
`;

export default function taskList({ text }: NodeSerializerOpts) {
  return createTag('div', { class: className }, text);
}
