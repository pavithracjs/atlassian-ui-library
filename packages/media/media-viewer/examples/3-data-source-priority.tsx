import * as React from 'react';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import { imageItem, defaultCollectionName } from '../example-helpers';
import { MediaViewer } from '../src';
import { ConversationResourceContext } from '@atlaskit/media-core';
import { conversationProvider } from './4-comments';

const context = createStorybookContext();
const selectedItem = imageItem;

export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <ConversationResourceContext.Provider value={conversationProvider}>
        <MediaViewer
          context={context}
          selectedItem={selectedItem}
          dataSource={{
            list: [selectedItem],
            collectionName: defaultCollectionName,
          }}
          collectionName={defaultCollectionName}
          onClose={() => this.setState({ selectedItem: undefined })}
        />
      </ConversationResourceContext.Provider>
    );
  }
}
