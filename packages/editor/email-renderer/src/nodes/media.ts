import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { N30, N50, N800 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName('media');

export const styles = `
.${className}-placeholder-inner {
  background-color: ${N30};
  border: 10px solid ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  color: ${N800},
}
.${className}-placeholder-outer {
  border: 1px solid ${N50};
  margin-top: 10px;
  border-radius: 3px;
  border-style: dashed;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.${className}-wrapper {
  margin: 24px auto;
  text-align: center;
}
`;

export default function media({ attrs }: NodeSerializerOpts) {
  let src;
  if (attrs.id) {
    // ID is defined, render image using CID:
    src = `cid:${attrs.id}`;
  } else if (attrs.url) {
    // url defined, user direct link image
    src = attrs.url;
  }
  if (src) {
    const style: any = {
      'max-width': '100%',
    };
    const elementAttrs: any = {};

    if (attrs.width) {
      elementAttrs.width = attrs.width;
    }
    if (attrs.height) {
      elementAttrs.height = attrs.height;
    }
    const img = createTag('img', {
      style: serializeStyle(style),
      src,
      ...elementAttrs,
    });
    return createTag('div', { class: `${className}-wrapper` }, img);
  }
  // no id or url found, fall back to placeholder
  const inner = createTag(
    'div',
    { class: `${className}-placeholder-inner` },
    `&nbsp;&rtri;&nbsp;${attrs.type}:&nbsp;${attrs.collection}&nbsp;`,
  );
  return createTag('div', { class: `${className}-placeholder-outer` }, inner);
}
