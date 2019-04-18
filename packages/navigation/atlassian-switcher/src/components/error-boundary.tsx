import * as React from 'react';
import styled from 'styled-components';
import {
  AnalyticsEventPayload,
  WithAnalyticsEventProps,
} from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme';
import { injectIntl, InjectedIntlProps, Messages } from 'react-intl';
import { ErrorBoundaryWrapper } from '../primitives/wrapper';
import FormattedMessage from '../primitives/formatted-message';
import {
  NAVIGATION_CHANNEL,
  OPERATIONAL_EVENT_TYPE,
  withAnalyticsEvents,
} from '../utils/analytics';

const TRIGGER_SUBJECT = 'errorBoundary';
const ACTION_SUBJECT = 'rendered';
// This image is also used as the generic erro message in Notifications
// https://bitbucket.org/atlassian/pf-home-ui/src/61c5702523da06c9440b865939b2457322efa9f9/src/components/GenericError/error.png?at=master
const NOT_FOUND_IMAGE =
  'https://home-static.us-east-1.prod.public.atl-paas.net/d138e521b9ef92669ae8d5c34874d91c.png';

const NotFoundImage = styled.img`
  height: ${gridSize() * 20}px;
`;
type ErrorBoundaryProps = {
  messages: Messages;
} & InjectedIntlProps &
  WithAnalyticsEventProps;

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  fireOperationalEvent = (payload: AnalyticsEventPayload) => {
    if (this.props.createAnalyticsEvent) {
      this.props
        .createAnalyticsEvent({
          eventType: OPERATIONAL_EVENT_TYPE,
          actionSubject: TRIGGER_SUBJECT,
          ...payload,
        })
        .fire(NAVIGATION_CHANNEL);
    }
  };

  componentDidCatch() {
    this.setState(
      {
        hasError: true,
      },
      () => {
        this.fireOperationalEvent({
          action: ACTION_SUBJECT,
        });
      },
    );
  }

  render() {
    const { messages, intl } = this.props;
    if (this.state.hasError) {
      return (
        <ErrorBoundaryWrapper>
          <NotFoundImage
            src={NOT_FOUND_IMAGE}
            alt={intl.formatMessage(messages.errorImageAltText)}
          />
          <h3>
            <FormattedMessage {...messages.errorHeading} />
          </h3>
          <p>
            <FormattedMessage {...messages.errorText} />
          </p>
        </ErrorBoundaryWrapper>
      );
    }

    return this.props.children;
  }
}

export default withAnalyticsEvents()(injectIntl(ErrorBoundary));
