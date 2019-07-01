import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';

export default function taskList({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
