import * as React from 'react';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';
import { CardLinkView } from '@atlaskit/media-ui';
import LazilyRender from 'react-lazily-render-scroll-parent';

import { CardWithUrl } from '../Card/types';
import { CardWithUrlContent as CardWithUrlContentType } from './component';
import { fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsHandler } from '../../utils/types';

export class CardWithURLRenderer extends React.PureComponent<
  CardWithUrl & WithAnalyticsEventProps
> {
  static CardContent: typeof CardWithUrlContentType | null = null;

  static moduleImporter(target: CardWithURLRenderer) {
    import(/* webpackChunkName:"@atlaskit-internal-smartcard-urlcardcontent" */ './component').then(
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
      appearance,
      isSelected,
      onClick,
      createAnalyticsEvent,
      container,
    } = this.props;

    // Wrapper around analytics.
    const dispatchAnalytics: AnalyticsHandler = evt =>
      fireSmartLinkEvent(evt, createAnalyticsEvent);

    if (!url) {
      throw new Error('@atlaskit/smart-card: url property is missing.');
    }

    return CardWithURLRenderer.CardContent !== null ? (
      <LazilyRender
        offset={100}
        component={appearance === 'inline' ? 'span' : 'div'}
        placeholder={
          <CardLinkView
            isSelected={isSelected}
            key={'lazy-render-placeholder'}
            link={url}
          />
        }
        scrollContainer={container}
        content={
          <CardWithURLRenderer.CardContent
            url={url}
            appearance={appearance}
            onClick={onClick}
            isSelected={isSelected}
            dispatchAnalytics={dispatchAnalytics}
            container={container}
          />
        }
      />
    ) : (
      <CardLinkView key={'chunk-placeholder'} link={url} />
    );
  }
}
