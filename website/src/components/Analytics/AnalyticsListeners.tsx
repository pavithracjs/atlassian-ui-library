import React from 'react';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import FeatureFlag from '../FeatureFlag';
import GoogleAnalyticsListener from './GoogleAnalyticsListener';

// AK-4967 - replace with real implementation from analytics-web-client
const mockAnalyticsClient: AnalyticsWebClient = {
  sendUIEvent: e => console.log('sendUIEvent', e),
  sendOperationalEvent: e => console.log('sendOperationalEvent', e),
  sendTrackEvent: e => console.log('sendTrackEvent', e),
  sendScreenEvent: e => console.log('sendScreenEvent', e),
};

const AnalyticsListeners = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAnalyticsListener>
      <FeatureFlag name="send-analytics-to-pipeline">
        {(yes: boolean) =>
          yes ? (
            <FabricAnalyticsListeners client={mockAnalyticsClient}>
              {children}
            </FabricAnalyticsListeners>
          ) : (
            children
          )
        }
      </FeatureFlag>
    </GoogleAnalyticsListener>
  );
};

export default AnalyticsListeners;
