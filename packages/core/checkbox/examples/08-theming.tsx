import React from 'react';
import { Checkbox } from '../src';
import { ComponentTokens, ThemeTokens } from '../src/types';
import merge from 'lodash.merge';

const newThemeTokens: ComponentTokens = {
  label: {
    spacing: {
      top: '6px',
      bottom: '6px',
    },
  },
  icon: {
    size: 'large',
  },
};

const customTheme = (
  current: (props: { tokens: ComponentTokens; mode: string }) => ThemeTokens,
  props: { tokens: ComponentTokens; mode: string },
) => {
  const themeTokens = current(props);
  return merge({}, themeTokens, newThemeTokens);
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
