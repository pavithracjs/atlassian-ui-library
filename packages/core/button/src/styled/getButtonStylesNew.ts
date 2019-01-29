import { css } from 'styled-components';
import { borderRadius, fontSize, gridSize, math } from '@atlaskit/theme';

export default (props: any) => {
  const baseSize = fontSize(props);
  const buttonHeight = `${math.divide(math.multiply(gridSize, 4), baseSize)(
    props,
  )}em`;
  const compactButtonHeight = `${math.divide(
    math.multiply(gridSize, 3),
    baseSize,
  )(props)}em`;

  let cursor = 'default';
  let padding = `0 ${gridSize(props)}px`;
  let height = buttonHeight;
  let lineHeight = buttonHeight;
  let transition =
    'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  let transitionDuration = '0.1s, 0.15s';
  let verticalAlign = 'middle';

  /** Spacing: Compact */
  if (props.spacing === 'compact') {
    height = compactButtonHeight;
    lineHeight = compactButtonHeight;
  }

  /** Spacing: Compact */
  if (props.spacing === 'none') {
    height = 'auto';
    lineHeight = 'inherit';
    padding = '0';
    verticalAlign = 'baseline';
  }

  /** Interaction: Hover */
  if (props.isHover) {
    cursor = 'pointer';
    transition =
      'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  }

  /** Interaction: Active */
  if (props.isActive) transitionDuration = '0s';

  /** Interaction: Focus */
  if (props.isFocus) transitionDuration = '0s, 0.2s';

  /** Disabled */
  if (props.isDisabled) cursor = 'not-allowed';

  return css`
    align-items: baseline;
    background: ${props.background};
    border-radius: ${borderRadius}px;
    border-width: 0;
    box-sizing: border-box;
    color: ${props.color} !important;
    cursor: ${cursor};
    display: inline-flex;
    font-size: inherit;
    font-style: normal;
    height: ${height};
    line-height: ${lineHeight};
    margin: 0;
    max-width: 100%;
    outline: none !important;
    padding: ${padding};
    text-align: center;
    text-decoration: ${props.textDecoration};
    transition: ${transition};
    transition-duration: ${transitionDuration};
    vertical-align: ${verticalAlign};
    white-space: nowrap;
    width: ${props.fit ? '100%' : 'auto'};
    box-shadow: 0 0 0 2px ${props.boxShadowColor};
    &::-moz-focus-inner {
      border: 0;
      margin: 0;
      padding: 0;
    }
    ${props.isLoading ? 'pointer-events: none' : null}
  `;
};
