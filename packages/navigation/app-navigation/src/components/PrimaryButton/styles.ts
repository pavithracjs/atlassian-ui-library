import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import css from '@emotion/css';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const chevronStyles = css`
  margin: 0 -${gridSize}px;
  visibility: hidden;
`;

export const buttonHeight = gridSize * 4;

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

// TODO marginRight
export const getPrimaryButtonTheme = ({
  mode: { primaryButton },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
) => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      display: 'inline-flex',
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: buttonHeight,
      marginLeft: margin.left,
      padding: padding.all,
      textTransform: 'uppercase',
      ...primaryButton.default,
      ':hover': primaryButton.hover,
      ':focus': primaryButton.focus,
      ':active': primaryButton.active,
      ':hover .chevron, :focus .chevron': {
        visibility: 'visible',
      },
    },
    spinnerStyles,
  };
};
