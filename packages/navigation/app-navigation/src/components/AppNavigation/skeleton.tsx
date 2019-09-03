/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ProductHomeSkeleton } from '../ProductHome';
import { PrimaryButtonSkeleton } from '../PrimaryButton';
import { CreateSkeleton } from '../Create';
import { SearchSkeleton } from '../Search';
import { SecondaryButtonSkeleton } from '../IconButton';
import { ProfileSkeleton } from '../Profile';
import getStyles, { secondaryItemStyles } from './styles';
import { AppNavigationSkeletonProps } from './types';

const styles = getStyles();

export const AppNavigationSkeleton = ({
  primaryItemsCount = 4,
  secondaryItemsCount = 4,
}: AppNavigationSkeletonProps) => {
  return (
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
          <SecondaryButtonSkeleton key={index} {...secondaryItemStyles} />
        ))}
        <ProfileSkeleton />
      </div>
    </div>
  );
};
