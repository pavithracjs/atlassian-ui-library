import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { CSSObject } from '@emotion/core';

const gridSize = gridSizeFn();

export default (): { outer: CSSObject; chevronWrapper: CSSObject } => ({
  chevronWrapper: {
    marginRight: `-${gridSize}px`,
    visibility: 'hidden',
  },
  outer: {
    ':hover,:focus': {
      '> div:last-child': {
        visibility: 'visible',
      },
    },
  },
});
