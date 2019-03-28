import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../util';

export const layoutColumnStyles = `
  @media (min-width: 600px) {
    .threeColumnLayout {
      width: 33%;
    }
    .twoColumnLayout {
      width: 50%;
    }
    .twoColumnLayout, .threeColumnLayout {
      display: inline-block;
    }
    .twoColumnLayout > div, .threeColumnLayout > div {
      padding: 10px;
    }
  }
`;

export default function layoutColumn({ text, attrs }: NodeSerializerOpts) {
  let className = '';
  if (attrs) {
    if (attrs.width === 50) {
      className = 'twoColumnLayout';
    } else if (attrs.width === 33.33) {
      className = 'threeColumnLayout';
    }
  }
  const innerDiv = createTag('div', {}, text);
  return createTag('div', { class: className }, innerDiv);
}
