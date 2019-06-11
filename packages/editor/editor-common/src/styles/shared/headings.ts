// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { typography } from '@atlaskit/theme';
import { HeadingAnchorWrapperClassName } from '../../ui/heading-anchor';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/

// From packages/core/theme/src/typography.js
// line height of the headings
// This is needed for anchor to align to the first line of heading

const getLineHeight = (fontCode: string): number =>
  typography.headingSizes[fontCode].lineHeight /
  typography.headingSizes[fontCode].size;

export const headingSizes: { [key: string]: { [key: string]: number } } = {
  h1: {
    lineHeight: getLineHeight('h700'),
  },
  h2: {
    lineHeight: getLineHeight('h600'),
  },
  h3: {
    lineHeight: getLineHeight('h500'),
  },
  h4: {
    lineHeight: getLineHeight('h400'),
  },
  h5: {
    lineHeight: getLineHeight('h300'),
  },
  h6: {
    lineHeight: getLineHeight('h100'),
  },
};

const buttonHoverStyle = css`
  & .${HeadingAnchorWrapperClassName} button {
    opacity: 0;
    transform: translate(8px, 0px);
    transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
    width: 0;
  }

  &:hover {
    & .${HeadingAnchorWrapperClassName} button {
      opacity: 1;
      transform: none;
      width: unset;
    }
  }
`;

export const headingsSharedStyles = css`
  & h1 {
    ${typography.h700};
    margin-bottom: 0;
    margin-top: 1.667em;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h1'].lineHeight}em;
    }
    
  }

  & h2 {
    ${typography.h600};
    margin-top: 1.8em;
    margin-bottom: 0;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h2'].lineHeight}em;
    }
  }

  & h3 {
    ${typography.h500};
    margin-top: 2em;
    margin-bottom: 0;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h3'].lineHeight}em;
    }
  }

  & h4 {
    ${typography.h400};
    margin-top: 1.357em;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h4'].lineHeight}em;
    }
  }

  & h5 {
    ${typography.h300};
    margin-top: 1.667em;
    text-transform: none;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h5'].lineHeight}em;
    }
  }

  & h6 {
    ${typography.h100};
    margin-top: 1.455em;
    text-transform: none;

    ${buttonHoverStyle}

    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes['h6'].lineHeight}em;
    }
  }
`;
