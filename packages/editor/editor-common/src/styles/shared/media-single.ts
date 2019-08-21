// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

const mediaSingleSharedStyle = css`
  li .media-single {
    margin: 0;
  }

  .mediaSingleView-content-wrap {
    user-select: none;
  }

  /* Hack for chrome to fix media single position
     inside a list when media is the first child */
  &.ua-chrome li > .mediaSingleView-content-wrap::before {
    content: '';
    display: block;
    height: 0;
  }

  table .media-single {
    margin-top: 0;
    margin-bottom: 0;
  }

  .media-single.image-wrap-left + .media-single.image-wrap-right,
  .media-single.image-wrap-right + .media-single.image-wrap-left,
  .media-single.image-wrap-left + .media-single.image-wrap-left,
  .media-single.image-wrap-right + .media-single.image-wrap-right {
    margin-right: 0;
    margin-left: 0;
  }
`;

export { mediaSingleSharedStyle };
