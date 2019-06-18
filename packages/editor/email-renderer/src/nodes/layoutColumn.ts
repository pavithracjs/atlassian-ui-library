import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../util';

export default function layoutColumn({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
