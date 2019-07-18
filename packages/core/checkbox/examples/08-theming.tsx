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
  { tokens, mode }: { tokens: ComponentTokens; mode: string },
) => {
  const mergedTokens = merge(tokens, newThemeTokens);
  return current({ tokens: mergedTokens, mode });
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
