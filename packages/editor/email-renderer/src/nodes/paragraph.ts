import { applyMarks } from '../apply-marks';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';
import { lineHeight, fontSize } from '../styles/common';

export const styles = `
.${createClassName('p')} {
  margin: 0;
  margin-bottom: 7px;
  padding: 0px;
  padding-top: 7px;
  mso-line-height-rule: exactly;
  line-height: ${lineHeight};
  font-size: ${fontSize};
}
`;
export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraph = createTag('p', { class: createClassName('p') }, text);
  return applyMarks(marks, paragraph);
}
