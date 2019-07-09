import React, { Node } from 'react';
import { ItemGroup } from '@atlaskit/item';
import { fontSizeSmall, gridSize as gridSizeFn } from '@atlaskit/theme';

interface Props {
  /** React Elements to be displayed within the group. This should generally be
   a collection of NavigationItems. */
  children?: Node;
  /** Set whether the text should be compacted. */
  isCompact?: boolean;
  /** Text to appear as heading above group. Will be auto-capitalised. */
  title?: string;
}

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

export const DrawerItemGroup = ({ title, isCompact, children }: Props) => {
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
