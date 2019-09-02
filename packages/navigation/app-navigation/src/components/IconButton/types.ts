import { ButtonProps } from '@atlaskit/button';

export type IconButtonProps = Pick<ButtonProps, 'onClick'> & {
  className?: string;
  icon: ButtonProps['iconBefore'];
  testId?: string;
  theme?: ButtonProps['theme'];
  tooltip: string;
};
