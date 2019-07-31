// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { typography } from '@atlaskit/theme';
import { HeadingAnchorWrapperClass } from '../../ui/heading-anchor';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/

// From packages/core/theme/src/typography.js
// line height of the headings
// This is needed for anchor to align to the first line of heading
export const headingSizes: { [key: string]: { [key: string]: number } } = {
  h1: {
    lineHeight: 28 / 24,
  },
  h2: {
    lineHeight: 24 / 20,
  },
  h3: {
    lineHeight: 20 / 16,
  },
  h4: {
    lineHeight: 16 / 14,
  },
  h5: {
    lineHeight: 16 / 12,
  },
  h6: {
    lineHeight: 16 / 11,
  },
};

export const headingsSharedStyles = css`
  & h1 {
    ${typography.h700};
    margin-bottom: 0;
    margin-top: 1.667em;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h1'].lineHeight}em;
    }
  }

  & h2 {
    ${typography.h600};
    margin-top: 1.8em;
    margin-bottom: 0;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h2'].lineHeight}em;
    }
  }

  & h3 {
    ${typography.h500};
    margin-top: 2em;
    margin-bottom: 0;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h3'].lineHeight}em;
    }
  }

  & h4 {
    ${typography.h400};
    margin-top: 1.357em;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h4'].lineHeight}em;
    }
  }

  & h5 {
    ${typography.h300};
    margin-top: 1.667em;
    text-transform: none;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h5'].lineHeight}em;
    }
  }

  & h6 {
    ${typography.h100};
    margin-top: 1.455em;
    text-transform: none;

    & .${HeadingAnchorWrapperClass} {
      position: absolute;
      height: ${headingSizes['h6'].lineHeight}em;
    }
  }

  & .headingView-content-wrap {
    clear: none;
  }
`;
