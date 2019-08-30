/** @jsx jsx */
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { jsx } from '@emotion/core';
import { PrimaryButton } from '../PrimaryButton';
import getStyles from './styles';
import { AppNavigationProps } from './types';

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'appNavigation',
};

const styles = getStyles();

export const AppNavigation = (props: AppNavigationProps) => {
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
  } = props;

  return (
    <NavigationAnalyticsContext data={analyticsData}>
      <div css={styles.outer}>
        <div css={styles.left}>
          {ProductHome && <ProductHome />}
          {primaryItems.map(props => (
            <PrimaryButton key={props.id} {...props} />
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
  );
};

AppNavigation.defaultProps = {
  primaryItems: [],
};
