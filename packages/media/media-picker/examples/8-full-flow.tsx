import * as React from 'react';
import {
  defaultCollectionName,
  createUploadContext,
} from '@atlaskit/media-test-helpers';
import { Card, FileIdentifier, CardEvent } from '@atlaskit/media-card';
import { MediaViewer, MediaViewerItem } from '@atlaskit/media-viewer';
import { FileDetails, MediaItemType } from '@atlaskit/media-core';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import { SelectWrapper, OptionsWrapper } from '../example-helpers/styled';
import { MediaPicker, UploadPreviewUpdateEventPayload } from '../src';

const context = createUploadContext();

const popup = MediaPicker('popup', context, {
  uploadParams: {
    collection: defaultCollectionName,
  },
});
const dataSourceOptions = [
  { label: 'List', value: 'list' },
  { label: 'Collection', value: 'collection' },
];
popup.show();

export type TenantFileRecord = {
  id: string;
  occurrenceKey?: string;
};
export type DataSourceType = 'collection' | 'list';
export interface State {
  events: Array<TenantFileRecord>;
  selectedItem?: MediaViewerItem;
  dataSourceType: DataSourceType;
}

export default class Example extends React.Component<{}, State> {
  state: State = { events: [], dataSourceType: 'list' };

  componentDidMount() {
    popup.on('uploads-start', payload => {
      const { events } = this.state;
      console.log('uploads-start', payload.files.map(file => file.id));
      this.setState({
        events: [
          ...events,
          ...payload.files.map(file => ({
            id: file.id,
            occurrenceKey: file.occurrenceKey,
          })),
        ],
      });
    });

    popup.on('upload-preview-update', this.onUploadPreviewUpdate);
  }

  private onUploadPreviewUpdate = async (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    console.log('onUploadPreviewUpdate id', event.file.id);
    console.log('onUploadPreviewUpdate upfrontId', await event.file.upfrontId);
  };

  private onCardClick = (occurrenceKey: string = '') => (event: CardEvent) => {
    if (event.mediaItemDetails) {
      this.setState({
        selectedItem: {
          id: (event.mediaItemDetails as FileDetails).id,
          occurrenceKey,
          type: 'file',
        },
      });
    }
  };

  private renderCards = () => {
    const { events } = this.state;

    return events.map((fileRecord, key) => {
      const identifier: FileIdentifier = {
        id: fileRecord.id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
        occurrenceKey: fileRecord.occurrenceKey,
      };

      return (
        <div key={key} style={{ display: 'inline-block', margin: '10px' }}>
          <Card
            context={context}
            identifier={identifier}
            dimensions={{
              width: 200,
              height: 200,
            }}
            onClick={this.onCardClick(identifier.occurrenceKey)}
          />
        </div>
      );
    });
  };

  private onCloseMediaViewer = () => {
    this.setState({ selectedItem: undefined });
  };

  private onDataSourceChange = (event: { value: DataSourceType }) => {
    this.setState({
      dataSourceType: event.value,
    });
  };

  private renderMediaViewer = () => {
    const { dataSourceType, selectedItem, events } = this.state;
    if (!selectedItem) {
      return null;
    }
    const list: MediaViewerItem[] = events.map(event => {
      return {
        id: event.id,
        occurrenceKey: event.occurrenceKey || '',
        type: 'file' as MediaItemType,
      };
    });
    const dataSource =
      dataSourceType === 'collection'
        ? { collectionName: defaultCollectionName }
        : { list };
    return (
      <MediaViewer
        context={context}
        selectedItem={selectedItem}
        dataSource={dataSource}
        collectionName={defaultCollectionName}
        onClose={this.onCloseMediaViewer}
      />
    );
  };

  render() {
    return (
      <>
        <OptionsWrapper>
          <Button appearance="primary" id="show" onClick={() => popup.show()}>
            Show
          </Button>
          <SelectWrapper>
            <Select
              options={dataSourceOptions}
              defaultValue={dataSourceOptions[0]}
              onChange={this.onDataSourceChange}
            />
          </SelectWrapper>
        </OptionsWrapper>
        <div>{this.renderCards()}</div>
        {this.renderMediaViewer()}
      </>
    );
  }
}
