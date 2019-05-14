import React, { ComponentType } from 'react';
import Theme from './components/Theme';

type LooseObject = {
  [key: string]: any;
};

// Pre-executes the theme and passes it as a prop to the supplied component.
// This is useful for ensuring that the current theme is accessible as props
// in styled-components.
export function withTheme<Props = {}>(InnerComponent: ComponentType<Props>) {
  return function ComponentWithTheme(props: Props) {
    return (
      <Theme.Consumer>
        {(tokens: LooseObject) => <InnerComponent {...props} theme={tokens} />}
      </Theme.Consumer>
    );
  };
}
