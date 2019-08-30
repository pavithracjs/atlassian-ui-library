/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

import { IconButton } from '../IconButton';
import { buttonTheme, createButtonStyles, createIconStyles } from './styles';
import { CreateProps } from './types';

export const Create = ({ onClick, text }: CreateProps) => (
  <Fragment>
    <Button css={createButtonStyles} onClick={onClick} theme={buttonTheme}>
      {text}
    </Button>
    <IconButton
      css={createIconStyles}
      icon={<AddIcon label={text} />}
      onClick={onClick}
      tooltip={text}
    />
  </Fragment>
);
