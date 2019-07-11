import React, { Component } from 'react';
import { Checkbox } from '../src';
import { ComponentTokens } from '../src/types';
import merge from 'lodash.merge';

const newThemeTokens = {
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
  current: Function,
  props: { tokens: ComponentTokens; mode: 'light' | 'dark' },
) => {
  const themeTokens = current(props);
  const mergedTokens = merge(themeTokens, newThemeTokens);
  return mergedTokens;
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
