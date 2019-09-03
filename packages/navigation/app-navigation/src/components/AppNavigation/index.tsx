/** @jsx jsx */
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { jsx } from '@emotion/core';

import { AppNavigationTheme, ThemeProvider, defaultTheme } from '../../theme';
import { ThemedPrimaryButton } from '../PrimaryButton';
import { styles } from './styles';
import { AppNavigationProps } from './types';

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'appNavigation',
};

export const AppNavigation = (
  props: AppNavigationProps & { theme: AppNavigationTheme },
) => {
  const {
    primaryItems,
    renderAppSwitcher: AppSwitcher,
    renderCreate: Create,
    renderHelp: Help,
    renderProductHome: ProductHome,
    renderProfile: Profile,
    renderNotifications: Notifications,
    renderSearch: Search,
    renderSettings: Settings,
    theme,
  } = props;

  return (
    <ThemeProvider theme={theme}>
      <NavigationAnalyticsContext data={analyticsData}>
        <div css={styles.outer}>
          <div css={styles.left}>
            {ProductHome && <ProductHome />}
            {primaryItems.map(props => (
              <ThemedPrimaryButton key={props.id} {...props} />
            ))}
          </div>
          <div css={styles.right}>
            {Create && <Create />}
            {Search && <Search />}
            {AppSwitcher && <AppSwitcher />}
            {Notifications && <Notifications />}
            {Settings && <Settings />}
            {Help && <Help />}
            <Profile />
          </div>
        </div>
      </NavigationAnalyticsContext>
    </ThemeProvider>
  );
};

AppNavigation.defaultProps = {
  primaryItems: [],
  theme: defaultTheme,
};
