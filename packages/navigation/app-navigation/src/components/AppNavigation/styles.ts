import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const styles = {
  outer: (theme: AppNavigationTheme) => {
    const {
      mode: { primary },
    } = theme;
    return {
      alignItems: 'center',
      backgroundColor: primary.background.default,
      boxSizing: 'border-box' as const,
      color: primary.text.default,
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'space-between',
      paddingLeft: gridSize * 2,
      paddingRight: gridSize * 2,
      height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
      width: '100vw',
    };
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    height: 'inherit',
  },
  right: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    right: gridSize * 4,
  },
  secondaryButtonSkeleton: {
    dimension: gridSize * 3.25,
    marginLeft: 0,
    marginRight: 5,
  },
};
