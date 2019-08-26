import React, { Component, useContext, FC } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsReactContext } from './AnalyticsReactContext';
import UIAnalyticsEvent, { UIAnalyticsEventHandler } from './UIAnalyticsEvent';

type Props = {
  /** Children! */
  children?: React.ReactNode;
  /** The channel to listen for events on. */
  channel?: string;
  /** A function which will be called when an event is fired on this Listener's
   * channel. It is passed the event and the channel as arguments. */
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
};

type InternalProps = {
  /** Children! */
  children?: React.ReactNode;
  /** The channel to listen for events on. */
  channel?: string;
  /** A function which will be called when an event is fired on this Listener's
   * channel. It is passed the event and the channel as arguments. */
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void;

  newContext: any;
};

const ContextTypes = {
  getAtlaskitAnalyticsEventHandlers: PropTypes.func,
};

class AnalyticsListenerInternal extends Component<InternalProps> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
  });

  getAnalyticsEventHandlers = () => {
    const { channel, onEvent } = this.props;
    const { getAtlaskitAnalyticsEventHandlers } = this.context;
    const parentEventHandlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    const handler: UIAnalyticsEventHandler = (event, eventChannel) => {
      if (channel === '*' || channel === eventChannel) {
        onEvent(event, eventChannel);
      }
    };

    return [handler, ...parentEventHandlers];
  };

  render() {
    const {
      newContext: { getAtlaskitAnalyticsContext },
      children,
    } = this.props;
    return (
      <AnalyticsReactContext.Provider
        value={{
          getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
          getAtlaskitAnalyticsContext,
        }}
      >
        {children}
      </AnalyticsReactContext.Provider>
    );
  }
}

const AnalyticsListener: FC<Props> = props => {
  const newContext = useContext(AnalyticsReactContext);
  return <AnalyticsListenerInternal {...props} newContext={newContext} />;
};

export default AnalyticsListener;
