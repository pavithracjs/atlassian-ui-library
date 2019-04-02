import * as React from 'react';
import RecentList from './LinkAddToolbar';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import { DispatchAnalyticsEvent } from '../../../analytics';

export interface Props {
  providerFactory: ProviderFactory;
  onBlur?: (text: string) => void;
  onSubmit?: (href: string, text?: string) => void;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export default class HyperlinkAddToolbar extends React.PureComponent<
  Props,
  {}
> {
  render() {
    const {
      onSubmit,
      onBlur,
      dispatchAnalyticsEvent,
      providerFactory,
    } = this.props;
    return (
      <WithProviders
        providers={['activityProvider']}
        providerFactory={providerFactory}
        renderNode={({ activityProvider }) => (
          <RecentList
            provider={activityProvider}
            onSubmit={onSubmit}
            onBlur={onBlur}
            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
          />
        )}
      />
    );
  }
}
