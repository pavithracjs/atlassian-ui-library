import { createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export const orderedListStyles = `
ol {
  list-style-type: decimal;
  margin-top: 12px;
  margin-bottom: 12px;
}
li > ol {
  margin-top: 0px;
  margin-bottom: 0px;
}
`;

export default function orderedList({ text }: NodeSerializerOpts) {
  return createTag('ol', {}, text);
}
