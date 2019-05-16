// @flow
import * as React from 'react';
import Button, { type ButtonProps } from '@atlaskit/button';

type Props = ButtonProps & { truncationWidth?: number };

// $FlowFixMe
export default React.forwardRef(({ truncationWidth, ...props }: Props, ref) => (
  <Button
    {...props}
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
