import React from 'react';

interface AnalyticsReactContextInterface {
  getAtlaskitAnalyticsContext(): any[];
  getAtlaskitAnalyticsEventHandlers(): any[];
}

export const AnalyticsReactContext = React.createContext<
  AnalyticsReactContextInterface
>({
  getAtlaskitAnalyticsContext: () => [],
  getAtlaskitAnalyticsEventHandlers: () => [],
});
