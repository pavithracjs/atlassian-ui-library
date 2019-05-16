import * as React from 'react';
import { ComponentClass, SyntheticEvent } from 'react';
import { Context, Identifier } from '@atlaskit/media-core';
import { IntlProvider, intlShape } from 'react-intl';
import { Shortcut } from '@atlaskit/media-ui';
import {
  withAnalyticsEvents,
  WithAnalyticsEventProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { mediaViewerModalEvent } from './analytics/media-viewer';
import { closedEvent, ClosedInputType } from './analytics/closed';
import { channel } from './analytics/index';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { ItemSource, MediaViewerFeatureFlags } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket } from './styled';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaViewerFeatureFlags;
  context: Context;
  itemSource: ItemSource;
} & WithAnalyticsEventProps;

export class MediaViewerComponent extends React.Component<Props, {}> {
  static contextTypes = {
    intl: intlShape,
  };

  static startTime: number = Date.now();
  static timerElapsed = () => Date.now() - MediaViewerComponent.startTime;

  private fireAnalytics = (payload: GasPayload | GasScreenEventPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const ev = createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };

  componentWillMount() {
    this.fireAnalytics(mediaViewerModalEvent());
    MediaViewerComponent.startTime = Date.now();
  }

  onShortcutClosed = () => {
    this.sendClosedEvent('escKey');
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  onContentClose = (_e?: SyntheticEvent, analyticsEvent?: UIAnalyticsEvent) => {
    const { onClose } = this.props;
    if (
      analyticsEvent &&
      analyticsEvent.payload &&
      analyticsEvent.payload.actionSubject === 'button'
    ) {
      this.sendClosedEvent('button');
    }
    if (onClose) {
      onClose();
    }
  };

  private sendClosedEvent(input: ClosedInputType) {
    this.fireAnalytics(closedEvent(input));
  }

  render() {
    const content = (
      <Blanket>
        {<Shortcut keyCode={27} handler={this.onShortcutClosed} />}
        <Content onClose={this.onContentClose}>{this.renderContent()}</Content>
      </Blanket>
    );

    return this.context.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }

  private renderContent() {
    const {
      selectedItem,
      context,
      onClose,
      itemSource,
      featureFlags,
    } = this.props;
    const defaultSelectedItem = selectedItem;

    if (itemSource.kind === 'COLLECTION') {
      return (
        <Collection
          pageSize={itemSource.pageSize}
          defaultSelectedItem={defaultSelectedItem}
          collectionName={itemSource.collectionName}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      const { items } = itemSource;
      const firstItem = items[0];

      return (
        <List
          defaultSelectedItem={defaultSelectedItem || firstItem}
          items={items}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else {
      return null as never;
    }
  }
}

export const MediaViewer = withAnalyticsEvents()(
  MediaViewerComponent,
) as ComponentClass<Props>;
