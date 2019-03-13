import { applyMarks, createTable } from '../util';
import { NodeSerializerOpts } from '../interfaces';
import { commonStyle } from '..';

const style = {
  ...commonStyle,
  padding: `8px 8px 8px 0`,
  '-moz-border-radius': '3px',
  'font-size': '14px',
  width: '100%',
  margin: `0px`,
};

export default function paragraph({ text, marks }: NodeSerializerOpts) {
  const paragraphAsTable = createTable([[{ style, text }]]);
  return applyMarks(marks, paragraphAsTable);
}
