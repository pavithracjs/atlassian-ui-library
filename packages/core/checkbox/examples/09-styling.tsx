import React from 'react';
import { Checkbox } from '../src';

const customIconWrapperStyles = (defaultStyles: any) => {
  return {
    ...defaultStyles,
    fill: 'green',
  };
};

export default () => (
  <Checkbox
    label="Remember me"
    styles={{ iconWrapper: customIconWrapperStyles }}
  />
);
