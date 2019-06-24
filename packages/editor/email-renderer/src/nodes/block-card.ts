import {
  NodeSerializerOpts,
  SmartCardWithDataAttributes,
  SmartCardWithUrlAttributes,
} from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { createTable } from '../table-util';

const borderRadius = {
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
};

const contentTextWithDataStyle = serializeStyle({
  padding: '7px 0 0 0',
  color: '#000000',
});

const blockWidth = {
  width: '400px',
  'min-width': '200px',
  'max-width': '400px',
};

const linkStyle = serializeStyle({
  border: 'none',
  background: 'transparent',
  color: '#000000',
  'text-decoration': 'none',
});

const cardHeaderTdStyle = {
  color: '#5E6C84',
  'font-size': '12px',
  'line-height': '24px',
};

const cardContentTdStyle = {
  ...borderRadius,
  padding: '6px 12px 12px 12px',
  background: '#FFFFFF',
  'font-size': '12px',
  'line-height': '18px',
  border: '#ebedf0 solid 1px',
};

const headingURLStyle = serializeStyle({
  ...blockWidth,
  overflow: 'hidden',
  color: '#000000',
  'font-size': '14px',
  'font-weight': '500',
  'text-overflow': 'ellipsis',
  'white-space': 'nowrap',
  'text-decoration': 'none',
});

const headingDataStyle = serializeStyle({
  'font-size': '16px',
  'line-height': '24px',
  'font-weight': '500',
});

const outerTdStyle = {
  ...borderRadius,
  padding: '2px 5px 5px 5px',
  margin: '0px',
  color: '#000000',
  'background-color': '#F4F5F7',
  'font-size': '12px',
};

const renderBlockCardWithData = (attrs: SmartCardWithDataAttributes) => {
  const name = attrs.data.name;
  const summary = attrs.data.summary;
  const heading = createTag('div', { style: headingDataStyle }, name);
  const text = createTag('div', { style: contentTextWithDataStyle }, summary);

  const blockContent = createTable(
    [
      [{ style: cardHeaderTdStyle, text: attrs.data.generator.name }],
      [{ style: cardContentTdStyle, text: `${heading}${text}` }],
    ],
    blockWidth,
  );

  return createTable(
    [[{ style: outerTdStyle, text: blockContent }]],
    blockWidth,
  );
};

const renderBlockCard = (
  attrs: SmartCardWithUrlAttributes,
  text?: string | null,
) => {
  const title = text || attrs.url;
  const heading = createTag('div', { style: headingURLStyle }, title);

  return createTable([[{ style: outerTdStyle, text: heading }]], blockWidth);
};

export default function blockCard({ attrs, text }: NodeSerializerOpts) {
  if (attrs.data) {
    const href = attrs.data.url;
    const card = renderBlockCardWithData(attrs as SmartCardWithDataAttributes);
    return href ? createTag('a', { href, style: linkStyle }, card) : card;
  }

  const href = attrs.url;
  const card = renderBlockCard(attrs as SmartCardWithUrlAttributes, text);
  return href ? createTag('a', { href, style: linkStyle }, card) : card;
}
