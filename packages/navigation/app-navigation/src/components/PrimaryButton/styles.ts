import { B400, B50 } from '@atlaskit/theme/colors';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import css from '@emotion/css';

const gridSize = gridSizeFn();

export const chevronStyles = css`
  margin: 0 -${gridSize}px;
  visibility: hidden;
`;

// TODO marginRight
export const primaryButtonTheme: any = (
  currentTheme: Function,
  themeProps: { appearance: string },
) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      backgroundColor: 'transparent',
      color: B50,
      display: 'inline-flex',
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: gridSize * 4,
      marginLeft: gridSize / 2,
      padding: gridSize / 2,
      textTransform: 'uppercase',
      ':hover, :focus': {
        backgroundColor: B400,
      },
      ':hover .chevron, :focus .chevron': {
        visibility: 'visible',
      },
    },
    spinnerStyles,
  };
};
