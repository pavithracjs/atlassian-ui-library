import * as tslib_1 from 'tslib';
import * as React from 'react';
import Button from '@atlaskit/button';
export default React.forwardRef(function(_a, ref) {
  var truncationWidth = _a.truncationWidth,
    props = tslib_1.__rest(_a, ['truncationWidth']);
  return React.createElement(
    Button,
    tslib_1.__assign({}, props, {
      ref: ref,
      theme: function(currentTheme, themeProps) {
        var _a = currentTheme(themeProps),
          buttonStyles = _a.buttonStyles,
          rest = tslib_1.__rest(_a, ['buttonStyles']);
        return tslib_1.__assign(
          {
            buttonStyles: tslib_1.__assign(
              {},
              buttonStyles,
              truncationWidth
                ? { maxWidth: truncationWidth + 'px !important' }
                : { flexShrink: 1, minWidth: 0 },
            ),
          },
          rest,
        );
      },
    }),
  );
});
//# sourceMappingURL=Button.js.map
