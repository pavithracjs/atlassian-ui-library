import { gridSize } from '@atlaskit/theme/constants';
import React from 'react';
import { IconButtonSkeleton } from '../IconButton/skeleton';

export const ProfileSkeleton = () => (
  <IconButtonSkeleton
    dimension={gridSize() * 4.75}
    marginLeft={6}
    marginRight={6}
  />
);
