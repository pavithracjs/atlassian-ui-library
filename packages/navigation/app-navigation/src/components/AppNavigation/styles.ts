import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const styles = {
  outer: (theme: AppNavigationTheme) => {
    const {
      mode: { navigation },
    } = theme;
    return {
      alignItems: 'center',
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'space-between',
      paddingLeft: gridSize * 2,
      paddingRight: gridSize * 2,
      height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
      width: '100vw',
      ...navigation,
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
};
