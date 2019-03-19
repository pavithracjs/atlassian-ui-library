// @flow
import * as React from 'react';
import Button from '@atlaskit/button';

// $FlowFixMe
export default React.forwardRef((props, ref) => (
  <Button
    {...props}
    ref={ref}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...(props.truncationWidth
            ? { maxWidth: `${props.truncationWidth}px !important` }
            : { flexShrink: 1, minWidth:0 }),
        },
        ...rest,
      }
    }}
  />
));
