import * as React from 'react';
import { css } from 'emotion';

type Props = {
  spacing: string;
  styles: any;
  isOnlyChild: boolean;
  isLoading?: boolean;
  icon: React.ReactChild;
};

export default (props: Props) => (
  <span className={css(props.styles)}>{props.icon}</span>
);
