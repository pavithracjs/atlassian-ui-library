import { createTag } from '../create-tag';
import { NodeSerializerOpts } from '../interfaces';

export default function decisionList({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
