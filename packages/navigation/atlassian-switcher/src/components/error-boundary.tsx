import * as React from 'react';
import { injectIntl, InjectedIntlProps, Messages } from 'react-intl';
import styled from 'styled-components';
import {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import { ErrorBoundaryWrapper } from '../primitives/wrapper';
import FormattedMessage from '../primitives/formatted-message';
import {
  NAVIGATION_CHANNEL,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
  withAnalyticsEvents,
} from '../utils/analytics';
import { errorToReason, Reason } from '../utils/error-to-reason';
import { FETCH_ERROR_NAME } from '../utils/fetch';

const TRIGGER_SUBJECT = 'errorBoundary';
const ACTION_SUBJECT = 'rendered';
// This image is also used as the generic error message in Notifications
// https://bitbucket.org/atlassian/pf-home-ui/src/61c5702523da06c9440b865939b2457322efa9f9/src/components/GenericError/error.png?at=master
const NOT_FOUND_IMAGE =
  'https://home-static.us-east-1.prod.public.atl-paas.net/d138e521b9ef92669ae8d5c34874d91c.png';

const NotFoundImage = styled.img`
  height: ${gridSize() * 20}px;
`;

interface ErrorBoundaryProps {
  messages: Messages;
  children: React.ReactNode;
}

type ErrorBoundaryState = {
  hasError: boolean;
  reason?: Reason;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps & InjectedIntlProps & WithAnalyticsEventsProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

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

  componentDidCatch(error: any) {
    const reason = errorToReason(error);

    this.setState(
      {
        hasError: true,
        reason,
      },
      () => {
        this.fireOperationalEvent({
          action: ACTION_SUBJECT,
          reason,
        });
      },
    );
  }

  handleLogin(
    _: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) {
    analyticsEvent
      .update({
        eventType: UI_EVENT_TYPE,
        actionSubjectId: 'login',
      })
      .fire(NAVIGATION_CHANNEL);
    window.location.reload();
  }

  renderErrorBody(reason: Reason, messages: Messages) {
    if (reason.name === FETCH_ERROR_NAME) {
      return reason.status === 401 ? (
        // Not authorised http error
        <React.Fragment>
          <FormattedMessage {...messages.errorTextLoggedOut} />
          <br />
          <br />
          <Button onClick={this.handleLogin}>
            <FormattedMessage {...messages.login} />
          </Button>
        </React.Fragment>
      ) : (
        // All other http errors
        <FormattedMessage {...messages.errorTextNetwork} />
      );
    }

    // Default error message
    return <FormattedMessage {...messages.errorText} />;
  }

  render() {
    const { messages, intl } = this.props;
    const { hasError, reason } = this.state;

    if (hasError) {
      return (
        <ErrorBoundaryWrapper>
          <NotFoundImage
            src={NOT_FOUND_IMAGE}
            alt={intl.formatMessage(messages.errorImageAltText)}
          />
          <h3>
            <FormattedMessage {...messages.errorHeading} />
          </h3>
          <p>{this.renderErrorBody(reason!, messages)}</p>
        </ErrorBoundaryWrapper>
      );
    }

    return this.props.children;
  }
}

export default withAnalyticsEvents()(injectIntl(ErrorBoundary));
