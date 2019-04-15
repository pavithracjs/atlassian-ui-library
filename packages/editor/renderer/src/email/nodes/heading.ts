import { NodeSerializerOpts } from '../interfaces';
import { createTag, applyMarks, serializeStyle } from '../util';
import { N800 } from '@atlaskit/adf-schema';

const baseHeadingStyle = {
  'font-style': 'inherit',
  color: N800,
  'font-weight': 600,
  'margin-bottom': 0,
};

const getHeadingStyle = (tagName: string) => {
  switch (tagName) {
    case 'h1':
      return {
        'font-size': '23px',
        'line-height': '1.1034',
        'margin-top': '40px',
        'letter-spacing': '-0.01em',
      };
    case 'h2':
      return {
        'font-size': '20px',
        'line-height': '1.1666',
        'margin-top': '36px',
        'font-weight': 500,
        'letter-spacing': '-0.01em',
      };
    case 'h3':
      return {
        'font-size': '16px',
        'line-height': '1.2',
        'margin-top': '32px',
        'font-weight': 500,
        'letter-spacing': '-0.008em',
      };
    case 'h4':
      return {
        'font-size': '14px',
        'line-height': '1.25',
        'margin-top': '20px',
        'letter-spacing': '-0.006em',
      };
    case 'h5':
      return {
        'font-size': '11px',
        'line-height': '1.4286',
        'margin-top': '20px',
        'letter-spacing': '-0.003em',
      };
    case 'h6':
      return {
        'font-size': '11px',
        'line-height': '1.3333',
        'text-transform': 'uppercase',
        'margin-top': '16px',
      };
    default:
      throw new Error(`Unknown tagName: ${tagName}`);
  }
};

export default function heading({ attrs, marks, text }: NodeSerializerOpts) {
  const tagName = `h${attrs.level}`;
  const style = serializeStyle({
    ...baseHeadingStyle,
    ...getHeadingStyle(tagName),
  });

  const headingTag = createTag(tagName, { style }, text);
  return applyMarks(marks, headingTag);
}
