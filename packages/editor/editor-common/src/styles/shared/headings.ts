// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/

export const headingSizes: { [key: string]: { [key: string]: number } } = {
  h1: {
    lineHeight: 1.167,
  },
  h2: {
    lineHeight: 1.2,
  },
  h3: {
    lineHeight: 1.25,
  },
  h4: {
    lineHeight: 1.429,
  },
  h5: {
    lineHeight: 1.333,
  },
  h6: {
    lineHeight: 1.455,
  },
};

export const headingsSharedStyles = css`
  & h1 {
    line-height: ${headingSizes.h1.lineHeight};
    font-size: 1.714em;
    margin-top: 1.667em;
    margin-bottom: 0;
  }

  & h2 {
    line-height: ${headingSizes.h2.lineHeight};
    font-size: 1.429em;
    margin-top: 1.8em;
    margin-bottom: 0;
  }

  & h3 {
    line-height: ${headingSizes.h3.lineHeight};
    font-size: 1.143em;
    margin-top: 2em;
    margin-bottom: 0;
  }

  & h4 {
    line-height: ${headingSizes.h4.lineHeight};
    font-size: 1em;
    margin-top: 1.357em;
  }

  & h5 {
    line-height: ${headingSizes.h5.lineHeight};
    font-size: 0.857em;
    margin-top: 1.667em;
  }

  & h6 {
    line-height: ${headingSizes.h6.lineHeight};
    font-size: 0.786em;
    margin-top: 1.455em;
  }
`;
