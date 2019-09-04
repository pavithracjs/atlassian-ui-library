import React, { FC } from 'react';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeProp } from '@atlaskit/theme/components';
import { GlobalThemeTokens } from '@atlaskit/theme/components';

import Container from './Container';
import Format from './Format';
import { Theme, ThemeAppearance, ThemeProps, ThemeTokens } from '../theme';

export interface BadgeProps {
  /** Affects the visual style of the badge. */
  appearance?: ThemeAppearance;

  /**
   * Supersedes the `value` props. The value displayed within the badge. A string can be provided for
   * custom-formatted numbers, however badge should only be used in cases where you want to represent
   * a number.
   */
  children?: number | string;

  /** The maximum value to display. If value is 100, and max is 50, "50+" will be displayed */
  max?: number;

  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}

const Badge: FC<BadgeProps> = ({
  theme,
  appearance = 'default',
  children = 0,
  max = 99,
}) => {
  return (
    <Theme.Provider value={theme}>
      <GlobalTheme.Consumer>
        {({ mode }: GlobalThemeTokens) => (
          <Theme.Consumer appearance={appearance} mode={mode}>
            {(tokens: ThemeTokens) => (
              <Container {...tokens}>
                {typeof children === 'string' ? (
                  children
                ) : (
                  <Format max={max}>{children}</Format>
                )}
              </Container>
            )}
          </Theme.Consumer>
        )}
      </GlobalTheme.Consumer>
    </Theme.Provider>
  );
};

export default Badge;
