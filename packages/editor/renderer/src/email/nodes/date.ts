import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';
import { isPastDate, timestampToString } from '@atlaskit/editor-common';
import { R50, R500, N40, N500 } from '@atlaskit/adf-schema';

type Color = 'neutral' | 'red';

type ColorMapping = {
  [K in Color]: { 'background-color': string; color: string }
};

const colorMapping: ColorMapping = {
  red: {
    'background-color': R50,
    color: R500,
  },
  neutral: {
    'background-color': N40,
    color: N500,
  },
};

export default function status({ attrs }: NodeSerializerOpts) {
  const timestamp: string = attrs.timestamp;
  let parentIsTask: boolean = false;
  if (attrs && attrs.state) {
    parentIsTask = true;
    console.log(attrs.state);
  }
  const colorAttributes =
    !!parentIsTask && isPastDate(timestamp)
      ? colorMapping.red
      : colorMapping.neutral;
  const css = serializeStyle({
    'border-radius': '3px',
    '-webkit-border-radius': '3px',
    '-moz-border-radius': '3px',
    'box-sizing': 'border-box',
    display: 'inline-block',
    'font-size': '14px',
    'font-weight': '400',
    'line-height': '1',
    'max-width': '100%',
    'vertical-align': 'baseline',
    padding: '2px 4px 3px 4px',
    ...colorAttributes,
  });
  const text = timestampToString(timestamp);

  return createTag('span', { style: css }, text);
}
