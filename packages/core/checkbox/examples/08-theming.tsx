import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Checkbox } from '../src';
import merge from 'lodash.merge';

const newThemeTokens = {
  icon: {
    boxColor: {
      rest: 'papayawhip',
      checked: 'hotpink',
    },
    size: 'large',
  },
};

const customTheme = (current, props) => {
  const themeTokens = current(props);
  const mergedTokens = merge(themeTokens, newThemeTokens);
  console.log('THEME TOKENS', mergedTokens);
  return mergedTokens;
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
