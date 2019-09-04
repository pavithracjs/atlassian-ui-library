/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

import { withAppNavigationTheme } from '../../theme';
import { ThemedIconButton } from '../IconButton';
import {
  createButtonStyles,
  createIconStyles,
  getCreateButtonTheme,
} from './styles';
import { CreateProps } from './types';

export const Create = ({ onClick, theme, text }: CreateProps) => (
  <Fragment>
    <Button
      css={createButtonStyles}
      onClick={onClick}
      theme={getCreateButtonTheme(theme)}
    >
      {text}
    </Button>
    <ThemedIconButton
      css={createIconStyles}
      icon={<AddIcon label={text} />}
      onClick={onClick}
      tooltip={text}
    />
  </Fragment>
);

export const ThemedCreate = withAppNavigationTheme(Create);
