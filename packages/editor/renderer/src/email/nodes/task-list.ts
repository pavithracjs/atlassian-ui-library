import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../util';

export default function taskList({ attrs, text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
