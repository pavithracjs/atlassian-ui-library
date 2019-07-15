import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';

interface Props extends ButtonProps {
  truncationWidth?: number;
}

export default React.forwardRef(({ truncationWidth, ...props }: Props, ref) => (
  <Button
    {...props}
    // @ts-ignore - 31052019 VBZ - sort of refs in Button
    ref={ref}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...(truncationWidth
            ? { maxWidth: `${truncationWidth}px !important` }
            : { flexShrink: 1, minWidth: 0 }),
        },
        ...rest,
      };
    }}
  />
));
