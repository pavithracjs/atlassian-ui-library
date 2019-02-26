import { borderRadius, fontSize, gridSize } from '@atlaskit/theme';
import { applyPropertyStyle, baseTheme } from '../theme';
import { getLoadingStyle } from './utils';
import {
  ButtonStyles,
  ButtonThemeProps,
  IconStyles,
  SpinnerStyles,
} from '../types';

type Spacing = 'compact' | 'default' | 'none';

const getBackground = (props: ButtonThemeProps) => {
  return applyPropertyStyle('background', props, baseTheme);
};

const getColor = (props: ButtonThemeProps) => {
  return applyPropertyStyle('color', props, baseTheme);
};

const getCursor = ({ state = 'default' }: { state: string }) => {
  let cursor = 'default';
  if (state === 'hover') cursor = 'pointer';
  if (state === 'disabled') cursor = 'not-allowed';
  return cursor;
};

const getPadding = (props: ButtonThemeProps) => {
  const paddingSize = (gridSize() * 1.5) / fontSize();
  let padLeft = props.iconBefore ? 0 : paddingSize;
  let padRight = props.iconAfter ? 0 : paddingSize;

  // Modifies padding while loading to center the loading spinner (while
  // keeping dimensions the same for buttons with icons both before and after)
  if (
    (props.iconBefore || props.iconAfter) &&
    !(props.iconBefore && props.iconAfter) &&
    props.isLoading
  )
    padLeft = padRight = paddingSize / 2;

  // TODO: RTL support
  let padding = `0 ${padRight}em 0 ${padLeft}em`;

  if (props.spacing === 'none' || props.iconIsOnlyChild) padding = '0';
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

const getBoxShadow = (props: ButtonThemeProps) => {
  const boxShadowColor = applyPropertyStyle('boxShadowColor', props, baseTheme);
  return `0 0 0 2px ${boxShadowColor}`;
};

const getWidth = ({
  spacing,
  shouldFitContainer,
}: {
  spacing: Spacing;
  shouldFitContainer: boolean;
}) => {
  let width = 'auto';
  if (spacing === 'compact') width = '100%';
  if (shouldFitContainer) width = '100%';
  return width;
};

const staticStyles = {
  alignItems: 'baseline',
  borderWidth: 0,
  boxSizing: 'border-box',
  display: 'inline-flex',
  fontSize: 'inherit',
  fontStyle: 'normal',
  fontWeight: 'normal',
  maxWidth: '100%',
  outline: 'none !important',
  textAlign: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export const getButtonStyles = (props: ButtonThemeProps): ButtonStyles => {
  const compactButtonHeight = `${(gridSize() * 3) / fontSize()}em`;
  const buttonHeight = `${(gridSize() * 4) / fontSize()}em`;

  const getLineHeight = ({ spacing = 'default' }: { spacing: Spacing }) => {
    let lineHeight = buttonHeight;
    if (spacing === 'compact') lineHeight = compactButtonHeight;
    if (spacing === 'none') lineHeight = 'inherit';
    return lineHeight;
  };

  return {
    ...staticStyles,
    background: getBackground(props),
    borderRadius: `${borderRadius()}px`,
    boxShadow: getBoxShadow(props),
    color: `${getColor(props)} !important`,
    cursor: getCursor(props),
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
};

export const getSpinnerStyles = (): SpinnerStyles => ({
  display: 'flex',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

const getIconMargin = (props: ButtonThemeProps) => {
  if (props.spacing === 'none') return 0;
  return `${gridSize() / 2}px`;
};

export const getIconStyles = (props: ButtonThemeProps): IconStyles => ({
  alignSelf: 'center',
  display: 'flex',
  flexShrink: 0,
  lineHeight: 0,
  fontSize: 0,
  margin: getIconMargin(props),
  userSelect: 'none',
  ...getLoadingStyle(props),
});
