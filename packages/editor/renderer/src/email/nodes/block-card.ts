import { NodeSerializerOpts, SmartCardAttributes } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const borderRadius = {
  'border-radius': '3px',
  '-webkit-border-radius': '3px',
  '-moz-border-radius': '3px',
};
const contentTextWithDataStyle = serializeStyle({
  padding: '7px 0 0 0',
  color: '#000000',
});
// const contentTextStyle = serializeStyle({padding: '3px 0 0 0', color: '#5E6C84'});
const width = { width: '400px', 'min-width': '200px', 'max-width': '400px' };
const tableStyle = serializeStyle({ ...width, 'border-spacing': '0px' });

const linkStyle = serializeStyle({
  border: 'none',
  background: 'transparent',
  color: '#000000',
  'text-decoration': 'none',
});

const cardHeaderTdStyle = serializeStyle({
  color: '#5E6C84',
  'font-size': '12px',
  'line-height': '24px',
});

const cardContentTdStyle = serializeStyle({
  ...borderRadius,
  padding: '6px 12px 12px 12px',
  background: '#FFFFFF',
  'font-size': '12px',
  'line-height': '18px',
  border: '#ebedf0 solid 1px',
});

const headingURLStyle = serializeStyle({
  ...width,
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

const outerTdStyle = serializeStyle({
  ...borderRadius,
  padding: '2px 5px 5px 5px',
  margin: '0px',
  color: '#000000',
  'background-color': '#F4F5F7',
  'font-size': '12px',
});

const renderBlockCardWithData = (attrs: SmartCardAttributes) => {
  const header = attrs.data.generator ? attrs.data.generator.name : '';
  const headerTd = createTag('td', { style: cardHeaderTdStyle }, header);
  const headerRow = createTag('tr', {}, headerTd);
  const contentHeading = createTag(
    'div',
    { style: headingDataStyle },
    attrs.data.name,
  );
  const contentText = createTag(
    'div',
    { style: contentTextWithDataStyle },
    attrs.data.summary,
  );
  const contentTd = createTag(
    'td',
    { style: cardContentTdStyle },
    contentHeading + contentText,
  );
  const contentRow = createTag('tr', {}, contentTd);
  const blockContent = createTag(
    'table',
    { style: tableStyle },
    headerRow + contentRow,
  );
  const outerTd = createTag('td', { style: outerTdStyle }, blockContent);
  const outerTable = createTag('table', { style: tableStyle }, outerTd);
  return outerTable;
};

const renderBlockCard = (attrs: SmartCardAttributes, text?: string | null) => {
  const fontTag = createTag(
    'font',
    { color: '#000000', style: linkStyle },
    text || attrs.url,
  );
  const contentHeading = createTag('div', { style: headingURLStyle }, fontTag);
  // TODO: Do we need to show 'Smart Card provider missing'? find out what this means exactly.
  // const contentText = createTag('div', {style: contentTextStyle}, 'Smart Card provider missing')
  const td = createTag('td', { style: outerTdStyle }, contentHeading);
  const table = createTag('table', { style: tableStyle }, td);
  return table;
};

export default function blockCard({ attrs, text }: NodeSerializerOpts) {
  if (attrs.data) {
    const href = attrs.data.url;
    const card = renderBlockCardWithData(attrs as SmartCardAttributes);
    return href ? createTag('a', { href, style: linkStyle }, card) : card;
  }
  const href = attrs.url;
  const card = renderBlockCard(attrs as SmartCardAttributes, text);
  return href ? createTag('a', { href, style: linkStyle }, card) : card;
}
