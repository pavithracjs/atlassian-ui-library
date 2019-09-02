import { B50 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

export const profileButtonTheme: any = (
  currentTheme: Function,
  themeProps: { appearance: string },
) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      backgroundColor: 'transparent',
      borderRadius: '100%',
      boxShadow: 'none',
      color: B50,
      cursor: 'pointer',
      display: 'inline-flex',
      flexShrink: 0,
      marginLeft: gridSize / 2,
      ':hover, :focus': {
        backgroundColor: 'none',
      },
    },
    spinnerStyles,
  };
};
