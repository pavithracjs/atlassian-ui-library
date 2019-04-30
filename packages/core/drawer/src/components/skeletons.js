// @flow
import React from 'react';
import { Skeleton as SkeletonAvatar } from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme';

type IsAvatarHidden = { isAvatarHidden?: boolean };
type IsCollapsed = { isCollapsed?: boolean };
type DrawerSkeletonHeaderProps = IsAvatarHidden & IsCollapsed;

const Wrapper = ({ isAvatarHidden, ...props }: IsAvatarHidden) => (
  <div
    css={{
      display: 'flex',
      alignItems: 'center',
      margin: isAvatarHidden
        ? `${gridSize() * 2}px`
        : `${gridSize() / 2}px ${gridSize()}px 0 ${gridSize()}px`,
    }}
    {...props}
  />
);

const SkeletonText = ({ isAvatarHidden }: IsAvatarHidden) => (
  <div
    css={{
      height: `${gridSize() * 2.5}px`,
      backgroundColor: 'currentColor',
      borderRadius: gridSize() / 2,
      opacity: 0.3,
      width: `${gridSize() * 18}px`,
      ...(!isAvatarHidden ? { marginLeft: `${gridSize() * 2}px` } : null),
    }}
  />
);

export const DrawerSkeletonHeader = (props: DrawerSkeletonHeaderProps) => {
  const { isAvatarHidden, isCollapsed } = props;
  return (
    <Wrapper isAvatarHidden={isAvatarHidden}>
      {!isAvatarHidden && (
        <SkeletonAvatar appearance="square" size="large" weight="strong" />
      )}
      {!isCollapsed && <SkeletonText isAvatarHidden={isAvatarHidden} />}
    </Wrapper>
  );
};
