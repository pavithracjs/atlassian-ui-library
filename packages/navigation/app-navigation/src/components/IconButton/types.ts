import { ButtonProps } from '@atlaskit/button';
import { AppNavigationTheme } from '../../theme';

export type IconButtonProps = Pick<ButtonProps, 'onClick'> & {
  className?: string;
  icon: ButtonProps['iconBefore'];
  testId?: string;
  theme: AppNavigationTheme;
  tooltip: string;
};

export type IconButtonSkeletonProps = {
  dimension?: number;
  marginLeft?: number;
  marginRight?: number;
};
