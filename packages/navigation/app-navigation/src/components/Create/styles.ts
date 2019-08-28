import { B500, B75 } from '@atlaskit/theme/colors';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import {
  actionSectionDesktopStyles,
  actionSectionMobileStyles,
} from '../../common/styles';

const gridSize = gridSizeFn();

const buttonOverrides = {
  backgroundColor: B75,
  color: B500,
  fontSize: fontSizeSmall(),
  fontWeight: 'bold',
  height: gridSize * 4,
  textTransform: 'uppercase',
};

export const buttonTheme: any = (
  currentTheme: Function,
  themeProps: { appearance: string },
) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...buttonOverrides,
    },
    spinnerStyles,
  };
};

export const createButtonStyles = actionSectionDesktopStyles;

export const createIconStyles = actionSectionMobileStyles;
