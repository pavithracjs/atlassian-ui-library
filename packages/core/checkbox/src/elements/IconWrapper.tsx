/** @jsx jsx */
import { jsx } from '@emotion/core';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { multiply } from '@atlaskit/theme/math';
import { ThemeTokens, ThemeIconTokens } from '../types';
import React from 'react';

interface Props {
  isActive?: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
  isHovered?: boolean;
  rest?: any;
  tokens: ThemeTokens;
}

export default ({ children, ...props }: IconProps) => (
  <span
    css={{
      lineHeight: 0,
      flexShrink: 0,
      color: getBoxColor(props),
      fill: getTickColor(props),
      transition: 'all 0.2s ease-in-out;',

      /* This is adding a property to the inner svg, to add a border to the checkbox */
      '& rect:first-of-type': {
        transition: 'stroke 0.2s ease-in-out;',
        ...getBorderColor(props),
      },

      /**
       * Need to set the Icon component wrapper to flex to avoid a scrollbar bug which
       * happens when checkboxes are flex items in a parent with overflow.
       * See AK-6321 for more details.
       **/
      '> span': {
        display: 'flex',
      },
    }}
    children={children}
  />
);
