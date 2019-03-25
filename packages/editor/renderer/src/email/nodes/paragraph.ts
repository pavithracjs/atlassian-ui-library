import { createTag, serializeStyle, applyMarks } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  margin: '0',
  padding: '7px 0px 7px 0px',
  'mso-line-height-rule': 'exactly',
  'line-heght': '24px',
  'font-size': '14px',
});

export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraph = createTag('p', { style: css }, text);
  return applyMarks(marks, paragraph);
}
