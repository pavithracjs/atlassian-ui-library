import Button, { ButtonAppearances } from '@atlaskit/button';
import * as React from 'react';

export type Props = {
  appearance?: ButtonAppearances;
  iconBefore?: React.ReactChild;
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  text?: React.ReactNode;
};

export const ShareButton: React.StatelessComponent<Props> = ({
  text,
  ...props
}) => <Button {...props}>{text}</Button>;

export default ShareButton;
