import * as React from 'react';
import Context from '../../providers/SmartCardContext';
import { Client, ObjectState } from '../../client';
import {
  BlockCardErroredView,
  InlineCardErroredView,
} from '@atlaskit/media-ui';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';
import InnerCardContainer from '../InnerCardContainer';

export interface CardContainerRenderProps {
  state: ObjectState;
  reload: () => void;
}

export type CardContainerProps = {
  client?: Client;
  isSelected?: boolean;
  appearance: 'block' | 'inline';
  url: string;
  children: (props: CardContainerRenderProps) => React.ReactNode;
} & WithAnalyticsEventProps;

export function CardContainer(props: CardContainerProps) {
  const {
    client: clientFromProps,
    url,
    children,
    isSelected,
    appearance,
    createAnalyticsEvent,
  } = props;
  return (
    <Context.Consumer>
      {clientFromContext => {
        const client = clientFromProps || clientFromContext;
        if (!client) {
          // tslint:disable-next-line:no-console
          console.error(
            `No Smart Card client provided. Provide a client via prop <Card client={new Client()} /> or by wrapping with a provider <SmartCardProvider><Card /></SmartCardProvider>.'`,
          );

          return appearance === 'inline' ? (
            <InlineCardErroredView
              url={url}
              isSelected={isSelected}
              message="Smart Card provider missing"
              onClick={() => window.open(url)}
            />
          ) : (
            <BlockCardErroredView
              url={url}
              isSelected={isSelected}
              message="Smart Card provider missing"
              onClick={() => window.open(url)}
            />
          );
        }

        return (
          <InnerCardContainer
            client={client}
            url={url}
            createAnalyticsEvent={createAnalyticsEvent}
          >
            {children}
          </InnerCardContainer>
        );
      }}
    </Context.Consumer>
  );
}
