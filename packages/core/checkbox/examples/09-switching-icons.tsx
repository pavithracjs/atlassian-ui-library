import React from 'react';
import { Checkbox, IconProps } from '../src';
import IconIndeterminate from '@atlaskit/icon/glyph/add-circle';
import Icon from '@atlaskit/icon/glyph/check-circle';

const customIconWrapperStyles = (defaultStyles: any, state: IconProps) => {
  return {
    ...defaultStyles,
    fill: state.isChecked ? 'white' : 'green',
  };
};

export default () => (
  <Checkbox
    label="That's not a standard Icon!"
    overrides={{
      IconWrapper: {
        cssFn: customIconWrapperStyles,
      },
      Icon: {
        component: Icon,
      },
      IconIndeterminate: {
        component: IconIndeterminate,
      },
    }}
  />
);
