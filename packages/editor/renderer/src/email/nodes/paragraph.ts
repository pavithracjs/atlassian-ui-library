import { applyMarks, createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export const paragraphStyles = `
p {
  margin: 0;
  margin-bottom: 7px;
  padding: 0px;
  padding-top: 7px;
  mso-line-height-rule: exactly;
  line-height: 24px;
  font-size: 14px;
}
`;

export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraph = createTag('p', {}, text);
  return applyMarks(marks, paragraph);
}
