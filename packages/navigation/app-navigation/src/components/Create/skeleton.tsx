/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import { ButtonSkeleton, IconButtonSkeleton } from './styles';

export const CreateSkeleton = () => (
  <Fragment>
    <ButtonSkeleton />
    <IconButtonSkeleton />
  </Fragment>
);
