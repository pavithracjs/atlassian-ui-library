import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../util';

export default function layoutSection({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
