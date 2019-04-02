import * as React from 'react';
import { Link } from './WrappedLink';
import Button, { ButtonProps } from '@atlaskit/button';

export type LinkButtonProps = {
  [index: string]: any;
  to: string | undefined;
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
      component={(props: ButtonProps) => (
        <Link to={props.href} {...props}>
          {props.children}
        </Link>
      )}
      href={to}
    >
      {children}
    </Button>
  );
}
