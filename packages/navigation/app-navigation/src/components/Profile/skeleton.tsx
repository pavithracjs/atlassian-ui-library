import React from 'react';
import { SecondaryButtonSkeleton } from '../IconButton';
import { profileItemStyles } from './styles';

export const ProfileSkeleton = () => (
  <SecondaryButtonSkeleton {...profileItemStyles} />
);
