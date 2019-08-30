import { CSSObject } from '@emotion/css';

export const getStyles = (): { [key: string]: CSSObject } => ({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  badgePositioner: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
  },
});
