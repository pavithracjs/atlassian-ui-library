import React from 'react';
import { Checkbox } from '../src';
import { ComponentTokens, EvaluatedTokens } from '../src/types';
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
  current: (
    props: { tokens: ComponentTokens; mode: string },
  ) => EvaluatedTokens,
  { tokens, mode }: { tokens: ComponentTokens; mode: string },
) => {
  const mergedTokens = merge(tokens, newThemeTokens);
  return current({ tokens: mergedTokens, mode });
};

export default () => <Checkbox label="Remember me" theme={customTheme} />;
