import { applyMarks, createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  margin: '0',
  'margin-bottom': '7px',
  padding: '0px',
  'padding-top': '7px',
  'mso-line-height-rule': 'exactly',
  'line-heght': '24px',
  'font-size': '14px',
});

export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraph = createTag('p', { style: css }, text);
  return applyMarks(marks, paragraph);
}
