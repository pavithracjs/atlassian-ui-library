/** @jsx jsx */
import { ThemeProvider } from 'emotion-theming';
import { jsx } from '@emotion/core';

import { AppNavigationTheme, ThemeProvider, defaultTheme } from '../../theme';

import { CreateSkeleton } from '../Create';
import { SecondaryButtonSkeleton } from '../IconButton';
import { PrimaryButtonSkeleton } from '../PrimaryButton';
import { ProductHomeSkeleton } from '../ProductHome';
import { ProfileSkeleton } from '../Profile';
import { SearchSkeleton } from '../Search';

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
            <SecondaryButtonSkeleton key={index} {...styles.secondaryButtonSkeleton} />
          ))}
          <ProfileSkeleton />
        </div>
      </div>
    </ThemeProvider>
  );
};
