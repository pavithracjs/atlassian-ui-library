/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';

import { ThemeProvider, defaultTheme } from '../../theme';

import { CreateSkeleton } from '../Create/skeleton';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';
import { ProductHomeSkeleton } from '../ProductHome/skeleton';
import { ProfileSkeleton } from '../Profile/skeleton';
import { SearchSkeleton } from '../Search/skeleton';

import { styles } from './styles';
import { AppNavigationSkeletonProps } from './types';

export const AppNavigationSkeleton = ({
  primaryItemsCount = 4,
  secondaryItemsCount = 4,
  theme = defaultTheme,
}: AppNavigationSkeletonProps) => {
  return (
    <ThemeProvider theme={theme}>
      <div css={styles.outer}>
        <div css={styles.left}>
          <ProductHomeSkeleton />
          {Array.from({ length: primaryItemsCount }, (_, index) => (
            <PrimaryButtonSkeleton key={index} />
          ))}
        </div>
        <div css={styles.right}>
          <CreateSkeleton />
          <SearchSkeleton />
          {Array.from({ length: secondaryItemsCount }, (_, index) => (
            <IconButtonSkeleton
              key={index}
              dimension={gridSize() * 3.25}
              marginLeft={0}
              marginRight={5}
            />
          ))}
          <ProfileSkeleton />
        </div>
      </div>
    </ThemeProvider>
  );
};
