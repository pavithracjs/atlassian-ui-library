import React, { ComponentType } from 'react';
import { withTheme as WithEmotionTheme } from 'emotion-theming';

import { light } from './modes';
import { GlobalTheme, ProductTheme, Theme, Mode } from './ts-types';

type F<P> = ((
  component: ComponentType<P>,
) => ReturnType<typeof WithEmotionTheme>);

const withTheme = <P extends {}>(defaultTheme: Theme): F<P> => {
  return WrappedComponent => {
    const WithTheme = WithEmotionTheme(props => {
      const { theme: ctxTheme, ...rest } = props;
      const theme =
        ctxTheme && Object.keys(ctxTheme).length > 0 ? ctxTheme : defaultTheme;
      return <WrappedComponent theme={theme} {...rest} />;
    });

    WithTheme.displayName = `WithTheme(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    return WithTheme;
  };
};

const defaultContentTheme: ProductTheme = {
  mode: light as Mode,
  context: 'container',
};
const defaultGlobalTheme: GlobalTheme = { mode: light };

type F2<P = {}, C = ComponentType<P>> = (WrappedComponent: C) => C;

export const withContentTheme: F2 = WrappedComponent =>
  withTheme(defaultContentTheme)(WrappedComponent);

export const withGlobalTheme: F2 = WrappedComponent =>
  withTheme(defaultGlobalTheme)(WrappedComponent);

export default withTheme;
