import React, { ComponentType } from 'react';
import Theme, { GlobalThemeTokens } from './components/Theme';

interface WithThemeProps {
  theme: GlobalThemeTokens;
}
// Pre-executes the theme and passes it as a prop to the supplied component.
// This is useful for ensuring that the current theme is accessible as props
// in styled-components.
export function withTheme<Props extends WithThemeProps>(
  InnerComponent: ComponentType<Props>,
) {
  return function ComponentWithTheme(props: Props) {
    return (
      <Theme.Consumer>
        {(tokens: GlobalThemeTokens) => (
          <InnerComponent {...props} theme={tokens} />
        )}
      </Theme.Consumer>
    );
  };
}
