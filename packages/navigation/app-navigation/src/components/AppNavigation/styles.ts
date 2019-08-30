import { B300, N0 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';

const gridSize = gridSizeFn();

export default () => ({
  outer: {
    alignItems: 'center',
    backgroundColor: B300,
    boxSizing: 'border-box' as const,
    color: N0,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'space-between',
    paddingLeft: gridSize * 2,
    paddingRight: gridSize * 2,
    height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
    width: '100vw',
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
});
