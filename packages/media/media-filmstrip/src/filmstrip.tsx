import * as React from 'react';
import { Component } from 'react';
import {
  Card,
  CardAction,
  CardOnClickCallback,
  CardEvent,
  OnSelectChangeFunc,
  OnLoadingChangeFunc,
  defaultImageCardDimensions,
  CardLoading,
} from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { Context, MediaClientConfig } from '@atlaskit/media-core';
import { XOR } from '@atlaskit/type-helpers';
import { FilmstripView } from './filmstripView';
import { generateIdentifierKey } from './utils/generateIdentifierKey';

export interface FilmstripItem {
  readonly identifier: Identifier;
  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
  readonly onClick?: CardOnClickCallback;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: OnSelectChangeFunc;
  readonly onLoadingChange?: OnLoadingChangeFunc;
}

interface WithContext {
  context?: Context;
}

interface WithMediaClientConfig {
  mediaClientConfig?: MediaClientConfig;
}

export type FilmstripProps = {
  items: FilmstripItem[];
  shouldOpenMediaViewer?: boolean;
} & XOR<WithContext, WithMediaClientConfig>;

export interface FilmstripState {
  animate: boolean;
  offset: number;
}

export class Filmstrip extends Component<FilmstripProps, FilmstripState> {
  state: FilmstripState = {
    animate: false,
    offset: 0,
  };

  private handleSize = ({ offset }: Pick<FilmstripState, 'offset'>) =>
    this.setState({ offset });
  private handleScroll = ({ animate, offset }: FilmstripState) =>
    this.setState({ animate, offset });

  private renderCards() {
    const {
      items,
      mediaClientConfig: mediaClientConfigProp,
      context,
      shouldOpenMediaViewer,
    } = this.props;

    const mediaViewerDataSource = shouldOpenMediaViewer
      ? { list: items.map(item => item.identifier) }
      : undefined;

    return items.map(item => {
      const key = generateIdentifierKey(item.identifier);

      let mediaClientConfig: MediaClientConfig;
      if (context) {
        mediaClientConfig = context.config;
      } else if (mediaClientConfigProp) {
        mediaClientConfig = mediaClientConfigProp;
      } else {
        return (
          <CardLoading key={key} dimensions={defaultImageCardDimensions} />
        );
      }

      return (
        <Card
          key={key}
          mediaClientConfig={mediaClientConfig}
          dimensions={defaultImageCardDimensions}
          useInlinePlayer={false}
          shouldOpenMediaViewer={shouldOpenMediaViewer}
          mediaViewerDataSource={mediaViewerDataSource}
          {...item}
        />
      );
    });
  }

  render() {
    const { animate, offset } = this.state;

    return (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
        {this.renderCards()}
      </FilmstripView>
    );
  }
}
