import { fontFamily, fontSize } from '@atlaskit/theme';
import { paragraphStyles } from './nodes/paragraph';
import { layoutColumnStyle } from './nodes/layoutColumn';
export default `
  .wrapper {
    font-family: ${fontFamily()};
    font-size: ${fontSize()}px;
    font-weight: 400;
    line-height: 24px;
  }
  table {
    font-family: ${fontFamily()};
    font-size: ${fontSize()}px;
    font-weight: 400;
    line-height: 24px;
  }
  ${paragraphStyles}
  ${layoutColumnStyle}
`;
