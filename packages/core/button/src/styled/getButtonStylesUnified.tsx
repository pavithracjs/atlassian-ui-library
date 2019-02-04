import { borderRadius, fontSize, gridSize, math } from '@atlaskit/theme';
import { cursorTo } from 'readline';

export default (props: any) => {
  const baseSize = fontSize(props);
  const compactButtonHeight = `${math.divide(
    math.multiply(gridSize, 3),
    baseSize,
  )(props)}em`;

  const buttonHeight = `${math.divide(math.multiply(gridSize, 4), baseSize)(
    props,
  )}em`;

  const getCursor = (props: any) => {
    let cursor = props.cursor || 'default';
    if (props.isHover) {
      cursor = 'pointer';
    }
    if (props.isDisabled) cursor = 'not-allowed';
    return cursor;
  };

  const getPadding = (props: any) => {
    let padding = `0 ${gridSize(props)}px`;
    if (props.spacing === 'none') {
      padding = '0';
    }
    return padding;
  };

  const getHeight = (props: any) => {
    let height = buttonHeight;
    if (props.spacing === 'compact') {
      height = compactButtonHeight;
    }
    if (props.spacing === 'none') {
      height = 'auto';
    }
    return height;
  };

  const getLineHeight = (props: any) => {
    let lineHeight = buttonHeight;
    if (props.spacing === 'compact') {
      lineHeight = compactButtonHeight;
    }
    if (props.spacing === 'none') {
      lineHeight = 'inherit';
    }
    return lineHeight;
  };

  const getTransition = (props: any) => {
    let transition =
      'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
    if (props.isHover) {
      transition =
        'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
    }
    return transition;
  };

  const getTransitionDuration = (props: any) => {
    let transitionDuration = '0.1s, 0.15s';
    if (props.isActive) transitionDuration = '0s';
    if (props.isFocus) transitionDuration = '0s, 0.2s';
    return transitionDuration;
  };

  const getVerticalAlign = (props: any) => {
    let verticalAlign = 'middle';
    if (props.spacing === 'none') {
      verticalAlign = 'baseline';
    }
    return verticalAlign;
  };

  const getBoxShadow = (props: any) => {
    return props.boxShadow || `0 0 0 2px ${props.boxShadowColor}`;
  };

  const styleProps = {
    cursor: getCursor(props),
    padding: getPadding(props),
    height: getHeight(props),
    lineHeight: getLineHeight(props),
    transition: getTransition(props),
    transitionDuration: getTransitionDuration(props),
    verticalAlign: getVerticalAlign(props),
    boxShadow: getBoxShadow(props),
    alignItems: 'baseline',
    borderRadius: borderRadius, //px
    borderBottom: props.borderBottom, //px
    borderWidth: 0,
    boxSizing: 'border-box',
    color: `${props.color} !important`,
    display: 'inline-flex',
    fontSize: 'inherit',
    fontStyle: 'normal',
    fontWeight: props.fontWeight,
    margin: 0,
    maxWidth: '100%',
    outline: 'none !important',
    textAlign: 'center',
    textDecoration: props.textDecoration,
    whiteSpace: 'nowrap',
    width: props.fit ? '100%' : 'auto',

    // &::-moz-focus-inner {
    //   border: 0,
    //   margin: 0,
    //   padding: 0,
    // }
    pointerEvents: props.isLoading ? 'pointer-events: none;' : null,
  };

  return styleProps;
};
