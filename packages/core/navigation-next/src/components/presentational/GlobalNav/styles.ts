import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { GLOBAL_NAV_WIDTH } from '../../../common/constants';
import { ModeColors } from '../../../theme/ts-types';

const gridSize = gridSizeFn();

const baseStyles = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  justifyContent: 'space-between',
  paddingBottom: `calc(${gridSize * 3 - 4}px)`,
  paddingTop: gridSize * 3,
  transition:
    'background-color 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.3s cubic-bezier(0.2, 0, 0, 1)',
  width: GLOBAL_NAV_WIDTH,
};

export default ({ product }: ModeColors) => (
  args: {
    topOffset: string;
  } | void,
) => ({
  ...baseStyles,
  height: `calc(100vh - ${(args && args.topOffset) || 0}px)`,
  backgroundColor: product.background.default,
  color: product.text.default,
  fill: product.background.default,
});
