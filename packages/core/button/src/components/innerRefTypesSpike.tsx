import * as React from 'react';

// From:
// https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315

export const withHOC = <T extends React.Component, OriginalProps extends {}>(
  WrappedComponent: React.ComponentClass<OriginalProps>,
) => {
  type PrivateProps = { innerRef: React.RefObject<T> };
  type Props = OriginalProps & PrivateProps;

  class WithHOC extends React.Component<Props> {
    render() {
      const { innerRef, ...restTmp } = this.props as PrivateProps;
      const rest = restTmp as OriginalProps;
      return <WrappedComponent ref={innerRef} {...rest} />;
    }
  }

  const RefForwardingFactory = (props: Props, ref: T) => (
    <WithHOC {...props} innerRef={ref} />
  );

  return React.forwardRef<T, OriginalProps>(RefForwardingFactory as any);
};
