import * as React from 'react';
import {
  createStorybookContext,
  externalImageIdentifier,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-core';
import { ButtonList, Container, Group } from '../example-helpers/styled';
import {
  archiveItem,
  audioItem,
  audioItemNoCover,
  docItem,
  imageItem,
  largeImageItem,
  smallImageItem,
  unsupportedItem,
  videoHorizontalFileItem,
  videoItem,
  videoLargeFileItem,
  videoProcessingFailedItem,
  wideImageItem,
  defaultCollectionName,
  videoSquareFileIdItem,
} from '../example-helpers';
import { MediaViewer } from '../src';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';
import { I18NWrapper } from '@atlaskit/media-test-helpers';
const context = createStorybookContext();

const handleEvent = (analyticsEvent: UIAnalyticsEventInterface) => {
  const { payload } = analyticsEvent;
  console.log('EVENT:', payload);
};

export type State = {
  selectedItem?: Identifier;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };

  setItem = (selectedItem: Identifier) => () => {
    this.setState({ selectedItem });
  };

  createItem = (item: Identifier, title: string) => {
    const onClick = this.setItem(item);

    return (
      <div>
        <h4>{title}</h4>
        <Card identifier={item} context={context} onClick={onClick} />
      </div>
    );
  };

  render() {
    const { selectedItem } = this.state;

    return (
      <I18NWrapper>
        <Container>
          <Group>
            <h2>Image</h2>
            <ButtonList>
              <li>{this.createItem(imageItem, 'Picture')}</li>
              <li>{this.createItem(smallImageItem, 'Icon')}</li>
              <li>{this.createItem(wideImageItem, 'Wide')}</li>
              <li>{this.createItem(largeImageItem, 'Large')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Document</h2>
            <ButtonList>
              <li>{this.createItem(docItem, 'Normal')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Video</h2>
            <ButtonList>
              <li>{this.createItem(videoHorizontalFileItem, 'Horizontal')}</li>
              <li>{this.createItem(videoLargeFileItem, 'Large')}</li>
              <li>{this.createItem(videoItem, 'Normal')}</li>
              <li>{this.createItem(videoSquareFileIdItem, 'Square + SD')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Audio</h2>
            <ButtonList>
              <li>{this.createItem(audioItem, 'Normal')}</li>
              <li>{this.createItem(audioItemNoCover, 'Song without cover')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>External images</h2>
            <ButtonList>
              <li>
                {this.createItem(externalImageIdentifier, 'Atlassian logo')}
              </li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Errors</h2>
            <ButtonList>
              <li>{this.createItem(unsupportedItem, 'Unsupported item')}</li>
              <li>{this.createItem(archiveItem, 'Archive has no preview')}</li>
              <li>
                {this.createItem(
                  videoProcessingFailedItem,
                  'Failed processing',
                )}
              </li>
            </ButtonList>
          </Group>
          {selectedItem && (
            <AnalyticsListener channel="media" onEvent={handleEvent}>
              <MediaViewer
                context={context}
                selectedItem={selectedItem}
                dataSource={{ list: [selectedItem] }}
                collectionName={defaultCollectionName}
                onClose={() => this.setState({ selectedItem: undefined })}
              />
            </AnalyticsListener>
          )}
        </Container>
      </I18NWrapper>
    );
  }
}
