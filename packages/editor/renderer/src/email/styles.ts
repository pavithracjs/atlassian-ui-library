import { fontFamily, fontSize } from '@atlaskit/theme';
import { paragraphStyles } from './nodes/paragraph';
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
  .tableNode td > :first-child,
  .tableNode th > :first-child {
    padding-top: 0px;
  }
  .tableNode td > :last-child,
  .tableNode th > :last-child{
    margin-bottom: 0px;
  }
  ${paragraphStyles}
`;
