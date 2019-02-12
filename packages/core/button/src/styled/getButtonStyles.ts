import { borderRadius, fontSize, gridSize, math } from '@atlaskit/theme';
import { applyPropertyStyle, baseTheme } from '../theme';

type Spacing = 'compact' | 'default' | 'none';

const getBackground = (props: any) => {
  return applyPropertyStyle('background', props, baseTheme);
};

const getColor = (props: any) => {
  return applyPropertyStyle('color', props, baseTheme);
};

// TODO when back from lunch.
const getBoxShadowColor = (props: any) => {
  return applyPropertyStyle('boxShadowColor', props, baseTheme);
};

const getCursor = ({ state = 'default' }: { state: string }) => {
  let cursor = 'default';
  if (state === 'hover') cursor = 'pointer';
  if (state === 'disabled') cursor = 'not-allowed';
  return cursor;
};

const getPadding = (props: any) => {
  let padding = `0 ${gridSize(props)}px`;
  if (props.spacing === 'none') padding = '0';
  return padding;
};

const getTransition = ({ state = 'default' }: { state: string }) => {
  let transition =
    'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  if (state === 'hover') {
    transition =
      'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  }
  return transition;
};

const getTransitionDuration = ({ state = 'default' }: { state: string }) => {
  let transitionDuration = '0.1s, 0.15s';
  if (state === 'active') transitionDuration = '0s';
  if (state === 'focus') transitionDuration = '0s, 0.2s';
  return transitionDuration;
};

const getVerticalAlign = ({ spacing = 'default' }: { spacing: Spacing }) => {
  return spacing === 'none' ? 'baseline' : 'middle';
};

const getBoxShadow = ({
  boxShadow,
  boxShadowColor,
}: {
  boxShadow: string;
  boxShadowColor: string;
}) => {
  return boxShadow || `0 0 0 2px ${boxShadowColor}`;
};

const getWidth = ({ spacing, fit }: { spacing: Spacing; fit: boolean }) => {
  let width = 'auto';
  if (spacing === 'compact') width = '100%';
  if (fit) width = '100%';
  return width;
};

const staticStyles = {
  alignItems: 'baseline',
  borderWidth: 0,
  boxSizing: 'border-box',
  display: 'inline-flex',
  fontSize: 'inherit',
  fontStyle: 'normal',
  maxWidth: '100%',
  outline: 'none !important',
  textAlign: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export default (props: any) => {
  const baseSize = fontSize(props);
  const compactButtonHeight = `${math.divide(
    math.multiply(gridSize, 3),
    baseSize,
  )(props)}em`;
  const buttonHeight = `${math.divide(math.multiply(gridSize, 4), baseSize)(
    props,
  )}em`;

  const getHeight = ({ spacing = 'default' }: { spacing: Spacing }) => {
    let height = buttonHeight;
    if (spacing === 'compact') height = compactButtonHeight;
    if (spacing === 'none') height = 'auto';
    return height;
  };

  const getLineHeight = ({ spacing = 'default' }: { spacing: Spacing }) => {
    let lineHeight = buttonHeight;
    if (spacing === 'compact') lineHeight = compactButtonHeight;
    if (spacing === 'none') lineHeight = 'inherit';
    return lineHeight;
  };

  const styleProps = {
    ...staticStyles,
    background: getBackground(props),
    borderRadius: `${borderRadius()}px`,
    boxShadow: getBoxShadow(props),
    color: `${getColor(props)} !important`,
    cursor: getCursor(props),
    fontWeight: props.fontWeight,
    height: getHeight(props),
    lineHeight: getLineHeight(props),
    padding: getPadding(props),
    transition: getTransition(props),
    transitionDuration: getTransitionDuration(props),
    verticalAlign: getVerticalAlign(props),
    width: getWidth(props),

    '&::-moz-focus-inner': {
      border: 0,
      margin: 0,
      padding: 0,
    },
    ...(props.isLoading && { 'pointer-events': 'none' }),
  };

  return styleProps;
};
