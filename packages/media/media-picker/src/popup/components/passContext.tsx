import { Component } from 'react';
import { AppProxyReactContext } from './app';
import { Store } from 'redux';
import { State } from '../domain';
import { UIAnalyticsEventHandlerSignature } from '@atlaskit/analytics-next';
import { intlShape, IntlProvider } from 'react-intl';

export interface PassMediaClientProps {
  store: Store<State>;
  proxyReactContext?: AppProxyReactContext;
}
export default class PassMediaClient extends Component<
  PassMediaClientProps,
  any
> {
  // We need to manually specify all the child mediaClients
  static childMediaClientTypes = {
    store() {},
    getAtlaskitAnalyticsEventHandlers() {},
    intl: intlShape,
  };

  private createDefaultI18nProvider = () =>
    new IntlProvider({ locale: 'en' }).getChildContext().intl;

  getChildContext() {
    const { store, proxyReactContext } = this.props;
    const getAtlaskitAnalyticsEventHandlers: UIAnalyticsEventHandlerSignature =
      proxyReactContext && proxyReactContext.getAtlaskitAnalyticsEventHandlers
        ? proxyReactContext.getAtlaskitAnalyticsEventHandlers
        : () => [];
    const intl =
      (proxyReactContext && proxyReactContext.intl) ||
      this.createDefaultI18nProvider();

    return {
      store,
      getAtlaskitAnalyticsEventHandlers,
      intl,
    };
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
