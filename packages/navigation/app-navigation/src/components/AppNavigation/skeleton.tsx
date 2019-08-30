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
  primaryItemCount = 4,
  secondaryItemCount = 4,
}: AppNavigationSkeletonProps) => {
  return (
    <div css={styles.outer}>
      <div css={styles.left}>
        <ProductHomeSkeleton />
        {new Array(primaryItemCount).fill(null).map((_, index) => (
          <PrimaryButtonSkeleton key={index} />
        ))}
      </div>
      <div css={styles.right}>
        <CreateSkeleton />
        <SearchSkeleton />
        {new Array(secondaryItemCount).fill(null).map((_, index) => (
          <SecondaryButtonSkeleton key={index} {...secondaryItemStyles} />
        ))}
        <ProfileSkeleton />
      </div>
    </div>
  );
};
