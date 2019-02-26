import * as React from 'react';
import { ButtonProps } from '../types';

// From:
// https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315

export const withHOC = <T extends React.Component, ButtonProps>(
  WrappedComponent: React.ComponentClass<ButtonProps>,
) => {
  type PrivateProps = { innerRef: React.RefObject<T> };
  type Props = ButtonProps & PrivateProps;

  class WithHOC extends React.Component<Props> {
    render() {
      const { innerRef, ...restTmp } = this.props as PrivateProps;
      const rest = restTmp as ButtonProps;
      return <WrappedComponent ref={innerRef} {...rest} />;
    }
  }

  const RefForwardingFactory = (props: Props, ref: T) => (
    <WithHOC {...props} innerRef={ref} />
  );

  return React.forwardRef<T, ButtonProps>(RefForwardingFactory as any);
};
