import * as React from 'react';
import { createStorybookMediaClient } from '@atlaskit/media-test-helpers';
import { imageItem, defaultCollectionName } from '../example-helpers';
import { MediaViewer } from '../src';

const mediaClient = createStorybookMediaClient();
const selectedItem = imageItem;

export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <MediaViewer
        mediaClientConfig={mediaClient.config}
        selectedItem={selectedItem}
        dataSource={{
          list: [selectedItem],
          collectionName: defaultCollectionName,
        }}
        collectionName={defaultCollectionName}
        onClose={() => this.setState({ selectedItem: undefined })}
      />
    );
  }
}
