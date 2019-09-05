import { withTheme as withEmotionTheme } from 'emotion-theming';
import React, { ComponentType } from 'react';

import { defaultTheme } from './themes';
import { AppNavigationTheme } from './types';

type ThemeProps = {
  theme: AppNavigationTheme;
};

export const withAppNavigationTheme = <P extends object>(
  WrappedComponent: ComponentType<P & Partial<ThemeProps>>,
) => {
  const WithAppNavigationTheme = withEmotionTheme((props: P & ThemeProps) => {
    const { theme: ctxTheme, ...rest } = props;
    const theme = Object.keys(ctxTheme).length > 0 ? ctxTheme : defaultTheme;
    return <WrappedComponent theme={theme} {...rest as P} />;
  });

  const name =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  WithAppNavigationTheme.displayName = `WithAppNavigationTheme(${name})`;

  return WithAppNavigationTheme;
};
