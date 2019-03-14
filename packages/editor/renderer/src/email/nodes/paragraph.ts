import { createTag, serializeStyle, applyMarks } from '../util';
import { NodeSerializerOpts } from '../interfaces';
import { commonStyle } from '..';

const style = serializeStyle({
  ...commonStyle,
  padding: `8px 8px 8px 0`,
  '-moz-border-radius': '3px',
  'font-size': '14px',
  width: '100%',
  margin: `0px`,
});

const tableStyle = serializeStyle({
  ...commonStyle,
  margin: 0,
  padding: 0,
  width: '100%',
  'border-spacing': '0px',
});

export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraphTd = createTag('td', { style }, text);
  const paragraphAsTable = createTag(
    'table',
    { style: tableStyle },
    paragraphTd,
  );

  return applyMarks(marks, paragraphAsTable);
}
