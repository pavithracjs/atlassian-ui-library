import * as React from 'react';
import { Link } from './WrappedLink';
import Button, { ButtonProps } from '@atlaskit/button';

export type LinkButtonProps = {
  [index: string]: any;
  to: string;
  children?: React.ReactChild;
};

export default function LinkButton({
  to,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      {...props}
      href={to}
      component={React.forwardRef<HTMLElement, ButtonProps>(
        ({ children, ...rest }, ref: any) => (
          <Link {...rest} ref={ref} to={to}>
            {children}
          </Link>
        ),
      )}
    >
      {children}
    </Button>
  );
}
