import * as React from 'react';
import { css } from 'emotion';
import { IconProps } from '../types';

export default (props: IconProps) => (
  <span className={css(props.styles)}>{props.icon}</span>
);
