// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { HeadingAnchorWrapperClassName } from '../../ui';

const mediaSingleSharedStyle = css`
  li .media-single {
    margin: 0;
  }

  /* Hack for chrome to fix media single position
     inside a list when media is the first child */
  &.ua-chrome li > .mediaSingleView-content-wrap::before {
    content: '';
    display: block;
    height: 0;
  }

  table .media-single {
    margin: 0;
  }

  .mediaSingleView-content-wrap {
    + .headingView-content-wrap {
      clear: none;

      & > h1,
      & > h2,
      & > h3,
      & > h4,
      & > h5,
      & > h6 {
        margin-top: 8px;
      }
    }

    &[layout='wrap-left'] {
      + .headingView-content-wrap {
        & > h1,
        & > h2,
        & > h3,
        & > h4,
        & > h5,
        & > h6 {
          .${HeadingAnchorWrapperClassName} {
            display: none;
          }
        }
      }
    }
  }

  .media-single.image-wrap-left {
    & + h1,
    & + h2,
    & + h3,
    & + h4,
    & + h5,
    & + h6 {
      .${HeadingAnchorWrapperClassName} {
        display: none;
      }
    }
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
