import * as React from 'react';
import { css } from 'emotion';
import { getLoadingStyle } from './utils';
import { gridSize } from '@atlaskit/theme';
import { IconProps } from '../types';

/** Icon Margin */
const getIconMargin = (props: IconProps) =>
  props.spacing === 'none'
    ? 0
    : props.isOnlyChild
    ? `0 -${gridSize() / 4}px`
    : `0 ${gridSize() / 2}px`;

const styles = (props: IconProps) => ({
  alignSelf: 'center',
  display: 'flex',
  flexShrink: 0,
  lineHeight: 0,
  fontSize: 0,
  userSelect: 'none',
  margin: getIconMargin(props),
  ...getLoadingStyle(props),
});

export default (props: IconProps) => (
  <span className={css(styles(props))}>{props.icon}</span>
);
