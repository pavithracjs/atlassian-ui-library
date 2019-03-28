import { MarkSerializerOpts } from '../interfaces';
import { createTable } from '../util';

export default function code({ mark, text }: MarkSerializerOpts) {
  // level 1 = 30px, level 2 = 60px, ...
  const style = {
    'padding-left': mark.attrs.level * 30 + 'px',
  };

  // Outlook accepts padding on <td> element, thus we wrap it with table here
  return createTable([[{ text, style }]]);
}
