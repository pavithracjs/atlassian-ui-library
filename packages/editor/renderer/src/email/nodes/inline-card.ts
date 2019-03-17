import {
  NodeSerializerOpts,
  SmartCardWithDataAttributes,
  SmartCardWithUrlAttributes,
} from '../interfaces';

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
  let scAttrs: SmartCardWithDataAttributes | SmartCardWithUrlAttributes;
  let textContent: string;
  let href: string;

  if (attrs.data) {
    scAttrs = attrs as SmartCardWithDataAttributes;
    href = scAttrs.data.url;
    textContent = scAttrs.data.name;
  } else {
    scAttrs = attrs as SmartCardWithUrlAttributes;
    href = scAttrs.url;
    textContent = scAttrs.url;
  }

  const card = createTag(
    'span',
    { style: cardStyle },
    `&nbsp;${textContent}&nbsp;`,
  );
  const fontTag = createTag(
    'font',
    { color: '#0052CC', style: linkStyle },
    card,
  );
  return href ? createTag('a', { href, style: linkStyle }, fontTag) : fontTag;
}
