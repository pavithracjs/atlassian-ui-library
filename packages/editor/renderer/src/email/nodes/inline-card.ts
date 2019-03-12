import { NodeSerializerOpts, SmartCardAttributes } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const borderRadius = {
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
};

const cardStyle = serializeStyle({
  ...borderRadius,
  padding: '0px 0px 2px 0px',
  'background-color': '#e9eaee',
  'line-height': '24px',
});

const linkStyle = serializeStyle({
  color: '#0052CC',
  border: 'none',
  background: 'transparent',
  'text-decoration': 'none',
});

export default function inlineCard({ attrs, text }: NodeSerializerOpts) {
  const scAttrs = attrs as SmartCardAttributes;

  const textContent = scAttrs.data ? scAttrs.data.name : text || scAttrs.url;
  const card = createTag(
    'span',
    { style: cardStyle },
    `&nbsp;${textContent}&nbsp;`,
  );
  const href = scAttrs.data ? scAttrs.data.url : scAttrs.url;
  const fontTag = createTag(
    'font',
    { color: '#0052CC', style: linkStyle },
    card,
  );
  return href ? createTag('a', { href, style: linkStyle }, fontTag) : fontTag;
}
