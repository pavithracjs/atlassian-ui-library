import * as React from 'react';
import { css } from 'emotion';
import { IconProps } from '../types';

export default ({ styles, icon }: IconProps) => (
  <span className={css(styles)}>{icon}</span>
);
