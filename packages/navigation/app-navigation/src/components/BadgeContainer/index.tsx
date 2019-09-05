/** @jsx jsx */
import { jsx } from '@emotion/core';
import { styles } from './styles';
import { BadgeProps } from './types';

export const BadgeContainer = (props: BadgeProps) => {
  const { badge: Badge, children } = props;
  return (
    // Set z-index: 1 to let the badge (if any) overlap other items.
    <div css={styles.container}>
      {children}
      <div css={styles.badgePositioner}>
        <Badge />
      </div>
    </div>
  );
};
