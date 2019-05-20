import { colors } from '@atlaskit/theme';

import { CONTENT_NAV_WIDTH } from '../../../common/constants';

import { ModeColors } from '../../../theme/ts-types';

const baseStyles = {
  boxSizing: 'border-box',
  height: '100%',
  left: 0,
  minWidth: CONTENT_NAV_WIDTH,
  overflowX: 'hidden',
  position: 'absolute',
  top: 0,
  width: '100%',
};

export default ({ product }: ModeColors) => () => ({
  container: {
    ...baseStyles,
    backgroundColor: colors.N20,
    color: colors.N500,
  },
  product: {
    ...baseStyles,
    backgroundColor: product.background.default,
    color: product.text.default,
  },
});
