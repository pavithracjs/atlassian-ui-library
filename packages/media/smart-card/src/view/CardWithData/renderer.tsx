import * as React from 'react';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';

import { CardWithData } from '../Card/types';
import { CardWithDataContent as CardWithDataContentType } from '.';

export class CardWithDataRenderer extends React.PureComponent<
  CardWithData & WithAnalyticsEventProps
> {
  static CardContent: typeof CardWithDataContentType | null = null;

  static moduleImporter(target: CardWithDataRenderer) {
    import(/* webpackChunkName:"@atlaskit-internal-smartcard-datacardcontent" */ './').then(
      module => {
        CardWithDataRenderer.CardContent = module.CardWithDataContent;
        target.forceUpdate();
      },
    );
  }

  componentDidMount() {
    if (CardWithDataRenderer.CardContent === null) {
      (this.props.importer || CardWithDataRenderer.moduleImporter)(this);
    }
  }

  render() {
    const { appearance, data, isSelected, onClick } = this.props;
    if (!data) {
      throw new Error(
        '@atlaskit/smart-cards: you are trying to render a card with data, but does not provide any',
      );
    }
    if (CardWithDataRenderer.CardContent) {
      return (
        <CardWithDataRenderer.CardContent
          appearance={appearance}
          data={data}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    }
    return <div card-with-data />;
  }
}
