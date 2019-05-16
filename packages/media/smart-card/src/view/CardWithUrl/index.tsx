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
  uiAuthEvent,
  uiCardClickedEvent,
  uiAuthAlternateAccountEvent,
  screenAuthPopupEvent,
  uiClosedAuthEvent,
  fireSmartLinkEvent,
} from '../../utils/analytics';
import { CardContainer } from '../../containers/CardContainer';
import { renderBlockCard } from '../BlockCard';
import { renderInlineCard } from '../InlineCard';

export type CardWithUrlContentProps = {
  client: Client;
  url: string;
  appearance: CardAppearance;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
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
            const definitionId = (state as any).definitionId;

            const handleAuthorise = () => {
              // UI Analytics for clicking connectAccount
              if (state.status === 'unauthorized') {
                fireSmartLinkEvent(
                  uiAuthEvent(definitionId, appearance),
                  createAnalyticsEvent,
                );
              }
              if (state.status === 'forbidden') {
                fireSmartLinkEvent(
                  uiAuthAlternateAccountEvent(definitionId, appearance),
                  createAnalyticsEvent,
                );
              }

              fireSmartLinkEvent(
                screenAuthPopupEvent(definitionId),
                createAnalyticsEvent,
              );

              // Operational Analytics for auth
              authFn(firstAuthService.startAuthUrl).then(
                () => {
                  fireSmartLinkEvent(
                    trackAppAccountConnected(definitionId),
                    createAnalyticsEvent,
                  );
                  fireSmartLinkEvent(
                    connectSucceededEvent(definitionId),
                    createAnalyticsEvent,
                  );
                  reload();
                },
                (err: Error) => {
                  if (err.message === 'The auth window was closed') {
                    fireSmartLinkEvent(
                      connectFailedEvent(definitionId, 'authWindowClosed'),
                      createAnalyticsEvent,
                    );
                    fireSmartLinkEvent(
                      uiClosedAuthEvent(definitionId, appearance),
                      createAnalyticsEvent,
                    );
                  } else {
                    fireSmartLinkEvent(
                      // Yes, dirty, but we had a ticket for that
                      connectFailedEvent(
                        definitionId,
                        'potentialSensitiveData',
                      ),
                      createAnalyticsEvent,
                    );
                  }
                  reload();
                },
              );
            };

            const defaultOnClick: React.EventHandler<
              React.MouseEvent | React.KeyboardEvent
            > = event => {
              if (state.status === 'resolved') {
                fireSmartLinkEvent(
                  uiCardClickedEvent(definitionId, appearance),
                  createAnalyticsEvent,
                );
              }
              if (onClick) {
                onClick(event);
              } else {
                const isSpecialKey = event.ctrlKey || event.metaKey;
                if (event.isDefaultPrevented() && isSpecialKey) {
                  window.open(url, '_blank');
                } else {
                  window.open(url, '_self');
                }
              }
            };

            if (appearance === 'inline') {
              return renderInlineCard(
                url,
                state,
                firstAuthService ? handleAuthorise : undefined,
                event => defaultOnClick(event),
                isSelected,
              );
            }

            return renderBlockCard(
              url,
              state,
              firstAuthService ? handleAuthorise : undefined,
              reload,
              event => defaultOnClick(event),
              isSelected,
            );
          }}
        </CardContainer>
      }
    />
  );
}
