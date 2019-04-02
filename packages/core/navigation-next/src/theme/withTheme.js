// @flow

import React, { type ComponentType } from 'react';
import { withTheme as WithEmotionTheme } from 'emotion-theming';

import { light } from './modes';
import type {
  GlobalTheme,
  ProductTheme,
  Theme,
  ThemeWrappedComp,
} from './types';

const withTheme = <P: {}, C: ComponentType<P>>(
  defaultTheme: Theme,
): (C => ThemeWrappedComp<C>) => {
  return WrappedComponent => {
    // $FlowFixMe - Flow types for WithEmotionTheme only want a component with a single 'theme' prop
    const WithTheme = WithEmotionTheme((props: P & { theme: Object }) => {
      const { theme: ctxTheme, ...rest } = props;
      const theme = Object.keys(ctxTheme).length > 0 ? ctxTheme : defaultTheme;
      return <WrappedComponent theme={theme} {...rest} />;
    });

    WithTheme.displayName = `WithTheme(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    return WithTheme;
  };
};

const defaultContentTheme: ProductTheme = { mode: light, context: 'container' };
const defaultGlobalTheme: GlobalTheme = { mode: light };

export const withContentTheme = <P: {}, C: ComponentType<P>>(
  WrappedComponent: C,
): ThemeWrappedComp<C> => withTheme(defaultContentTheme)(WrappedComponent);

export const withGlobalTheme = <P: {}, C: ComponentType<P>>(
  WrappedComponent: C,
): ThemeWrappedComp<C> => withTheme(defaultGlobalTheme)(WrappedComponent);

export default withTheme;
