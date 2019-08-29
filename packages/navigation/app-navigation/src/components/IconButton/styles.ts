import { B400, B50 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

export const iconButtonTheme: any = (
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
      height: gridSize * 4,
      marginLeft: gridSize / 2,
      padding: gridSize / 2,
      ':hover, :focus': {
        backgroundColor: B400,
      },
    },
    spinnerStyles,
  };
};
