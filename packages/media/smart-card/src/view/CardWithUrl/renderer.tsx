import * as React from 'react';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';
import { CardLinkView } from '@atlaskit/media-ui';
import { auth } from '@atlaskit/outbound-auth-flow-client';

import { CardWithUrl } from '../Card/types';
import { CardWithUrlContent as CardWithUrlContentType } from '.';

export class CardWithURLRenderer extends React.PureComponent<
  CardWithUrl & WithAnalyticsEventProps
> {
  static CardContent: typeof CardWithUrlContentType | null = null;

  static moduleImporter(target: CardWithURLRenderer) {
    import(/* webpackChunkName:"@atlaskit-internal-smartcard-urlcardcontent" */ './').then(
      module => {
        CardWithURLRenderer.CardContent = module.CardWithUrlContent;
        target.forceUpdate();
      },
    );
  }

  componentDidMount() {
    if (CardWithURLRenderer.CardContent === null) {
      (this.props.importer || CardWithURLRenderer.moduleImporter)(this);
    }
  }

  render() {
    const {
      url,
      client,
      appearance,
      isSelected,
      onClick,
      createAnalyticsEvent,
      container,
    } = this.props;

    if (!url) {
      throw new Error('@atlaskit/smart-card: url property is missing.');
    }

    return CardWithURLRenderer.CardContent !== null ? (
      <CardWithURLRenderer.CardContent
        url={url}
        client={client!}
        appearance={appearance}
        onClick={onClick}
        isSelected={isSelected}
        createAnalyticsEvent={createAnalyticsEvent}
        authFn={auth}
        container={container}
      />
    ) : (
      <CardLinkView key={'chunk-placeholder'} link={url} />
    );
  }
}
