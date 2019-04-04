//@flow
import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

export type NavigatorPropsType = {
  /** This will be passed in as aria-label to button. This is what screen reader will read */
  'aria-label'?: string,
  /** React node to render in the button, pass the text you want use to view on pagination button */
  children?: any,
  /** Is the navigator disabled */
  isDisabled?: boolean,
  /** This function is called with the when user clicks on navigator */
  onClick?: Function,
  /** Add the padding styles to the navigator
   * This can we used to add padding when displaying a icon
   */
  styles?: Object,
};

export default (props: ButtonProps) => (
  <Button
    {...props}
    appearance="subtle"
    spacing="none"
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      const halfGridSize = gridSize() / 2;
      return {
        buttonStyles: {
          ...buttonStyles,
          paddingLeft: `${halfGridSize}px`,
          paddingRight: `${halfGridSize}px`,
          'html[dir=rtl] &': {
            transform: 'rotate(180deg)',
          },
        },
        ...rest,
      };
    }}
  />
);
