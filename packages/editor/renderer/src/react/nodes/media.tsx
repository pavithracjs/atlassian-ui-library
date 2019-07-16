import * as React from 'react';
import { PureComponent } from 'react';
import {
  WithProviders,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { ProviderFactory } from '@atlaskit/editor-common';
import { MediaCard, MediaCardProps, MediaProvider } from '../../ui/MediaCard';

export interface MediaProps extends MediaCardProps {
  providers?: ProviderFactory;
}

type Providers = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};
export default class Media extends PureComponent<MediaProps, {}> {
  private renderCard = (providers: Providers = {}) => {
    const { mediaProvider, contextIdentifierProvider } = providers;

    return (
      <MediaCard
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        {...this.props}
      />
    );
  };

  render() {
    const { providers } = this.props;

    if (!providers) {
      return this.renderCard();
    }

    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providers}
        renderNode={this.renderCard}
      />
    );
  }
}
