import * as React from 'react';
import { Link } from './WrappedLink';
import Button, { filterHTMLAttributes } from '@atlaskit/button';

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
      component={({ href, children, ...props }) => (
        <Link to={href} {...filterHTMLAttributes(props)}>
          {children}
        </Link>
      )}
      href={to}
      {...props}
    >
      {children}
    </Button>
  );
}
