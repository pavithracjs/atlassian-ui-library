import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { CardLinkView } from '@atlaskit/media-ui';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';

import { Client } from '../../client';
import { DefinedState } from '../../client/types';
import { CardAppearance } from '../Card/types';
import {
  connectFailedEvent,
  connectSucceededEvent,
  trackAppAccountConnected,
  ANALYTICS_CHANNEL,
} from '../../utils/analytics';
import { CardContainer } from '../../containers/CardContainer';
import { renderBlockCard } from '../BlockCard';
import { renderInlineCard } from '../InlineCard';

export type CardWithUrlContentProps = {
  client: Client;
  url: string;
  appearance: CardAppearance;
  onClick?: () => void;
  isSelected?: boolean;
  authFn: (startUrl: string) => Promise<void>;
} & WithAnalyticsEventProps;

export function CardWithUrlContent(props: CardWithUrlContentProps) {
  const {
    url,
    isSelected,
    onClick,
    client,
    appearance,
    createAnalyticsEvent,
    authFn,
  } = props;
  return (
    <LazyRender
      offset={100}
      component={appearance === 'inline' ? 'span' : 'div'}
      placeholder={
        <CardLinkView
          isSelected={isSelected}
          key={'lazy-render-placeholder'}
          link={url}
        />
      }
      content={
        <CardContainer
          client={client}
          url={url}
          isSelected={isSelected}
          appearance={appearance}
          createAnalyticsEvent={createAnalyticsEvent}
        >
          {({ state, reload }) => {
            // TODO: support multiple auth services
            const firstAuthService =
              (state as DefinedState).services &&
              (state as DefinedState).services[0];

            const handleAuthorise = () => {
              authFn(firstAuthService.startAuthUrl).then(
                () => {
                  if (createAnalyticsEvent) {
                    createAnalyticsEvent(
                      trackAppAccountConnected((state as any).definitionId),
                    ).fire(ANALYTICS_CHANNEL);
                    createAnalyticsEvent(
                      connectSucceededEvent(url, state),
                    ).fire(ANALYTICS_CHANNEL);
                  }
                  reload();
                },
                (err: Error) => {
                  if (createAnalyticsEvent) {
                    createAnalyticsEvent(
                      // Yes, dirty, but we had a ticket for that
                      err.message === 'The auth window was closed'
                        ? connectFailedEvent(
                            'auth.window.was.closed',
                            url,
                            state,
                          )
                        : connectFailedEvent(
                            'potential.sensitive.data',
                            url,
                            state,
                          ),
                    ).fire(ANALYTICS_CHANNEL);
                  }
                  reload();
                },
              );
            };

            if (appearance === 'inline') {
              return renderInlineCard(
                url,
                state,
                firstAuthService ? handleAuthorise : undefined,
                () => (onClick ? onClick() : window.open(url)),
                isSelected,
              );
            }

            return renderBlockCard(
              url,
              state,
              firstAuthService ? handleAuthorise : undefined,
              reload,
              () => (onClick ? onClick() : window.open(url)),
              isSelected,
            );
          }}
        </CardContainer>
      }
    />
  );
}
