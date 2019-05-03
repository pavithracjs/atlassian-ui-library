import { createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export const bulletListStyles = `
ul {
  list-style-type: disc;
  margin-top: 12px;
  margin-bottom: 12px;
}
li > ul {
  margin-top: 0px;
  margin-bottom: 0px;
}
`;

export default function bulletList({ text }: NodeSerializerOpts) {
  return createTag('ul', {}, text);
}
