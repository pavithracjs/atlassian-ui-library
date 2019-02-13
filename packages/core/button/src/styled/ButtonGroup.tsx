import { gridSize } from '@atlaskit/theme';

export const groupStyles = `
  display: inline-flex;
`;

export const groupItemStyles = `
  flex: 1 0 auto;
  display: flex;

  /* margins don't flip when the layout uses dir="rtl", whereas pseudos do */
  & + &::before {
    content: '';
    display: inline-block;
    width: ${gridSize() / 2}px;
  }
`;
