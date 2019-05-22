import React, { FC } from 'react';
import { ItemGroup } from '@atlaskit/item';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { fontSizeSmall } from '@atlaskit/theme/constants';

type Props = {
  /** Set whether the text should be compacted. */
  isCompact?: boolean;
  /** Text to appear as heading above group. Will be auto-capitalised. */
  title?: string;
};

const groupTitleFontSize = fontSizeSmall();
const gridSize = gridSizeFn();

const SkeletonGroupTitle = ({ ...props }) => (
  <div
    css={{
      fontSize: `${groupTitleFontSize}px`,
      lineHeight: `${(gridSize * 2) / groupTitleFontSize}`,
      fontWeight: 600,
      marginTop: `${gridSize * 1.5}px`,
    }}
    {...props}
  />
);
const ItemChildrenWrapper = ({ ...props }) => (
  <div css={{ marginLeft: `${gridSize}px` }} {...props} />
);
const ItemGroupWrapper = ({ ...props }) => (
  <div css={{ paddingRight: `${gridSize * 4}px` }} {...props} />
);

export const DrawerItemGroup: FC<Props> = ({ title, isCompact, children }) => {
  const wrappedTitle = title ? (
    <SkeletonGroupTitle>{title}</SkeletonGroupTitle>
  ) : null;

  return (
    <ItemGroupWrapper>
      <ItemGroup title={wrappedTitle} isCompact={isCompact}>
        <ItemChildrenWrapper>{children}</ItemChildrenWrapper>
      </ItemGroup>
    </ItemGroupWrapper>
  );
};
