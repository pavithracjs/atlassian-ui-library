import React, { Component, FC, MouseEvent } from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  useAnalyticsEvents_experimental,
} from '../src';

interface Props extends WithAnalyticsEventsProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

class ButtonBase extends Component<Props> {
  handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent!({
      action: 'click',
    });

    // Fire our analytics event on the 'atlaskit' channel
    analyticsEvent.fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

const Button = withAnalyticsEvents()(ButtonBase);

const FunctionalButton: FC<Props> = ({ onClick, ...props }) => {
  // Decompose function from the hook
  const { createAnalyticsEvent } = useAnalyticsEvents_experimental();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create our analytics event
    const analyticsEvent = createAnalyticsEvent({ action: 'click' });

    // Fire our analytics event
    analyticsEvent.fire('atlaskit');

    if (onClick) {
      onClick(e);
    }
  };

  return <button {...props} onClick={handleClick} />;
};

export default class App extends Component<void> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <Button onClick={() => console.log('onClick callback')}>
          Click me (HOC)
        </Button>
        <FunctionalButton onClick={() => console.log('onClick callback')}>
          Click me (Hook)
        </FunctionalButton>
      </AnalyticsListener>
    );
  }
}
