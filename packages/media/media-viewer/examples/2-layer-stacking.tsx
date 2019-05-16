import * as React from 'react';
import Button from '@atlaskit/button';
import ModalDialog from '@atlaskit/modal-dialog';
import {
  createStorybookMediaClient,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { imageItem } from '../example-helpers';
import { MediaViewer } from '..';
import { Identifier } from '@atlaskit/media-client';

const mediaClient = createStorybookMediaClient();

export type State = {
  selectedItem?: Identifier;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };
  setItem = (selectedItem: Identifier) => () => {
    this.setState({ selectedItem });
  };

  render() {
    return (
      <div>
        <ModalDialog>
          <h1>This is a modal dialog</h1>
          <p>MediaViewer should open on top of the modal dialog</p>
          <Button onClick={this.setItem(imageItem)}>Open MediaViewer</Button>
        </ModalDialog>

        {this.state.selectedItem && (
          <MediaViewer
            mediaClient={mediaClient}
            selectedItem={this.state.selectedItem}
            dataSource={{ list: [this.state.selectedItem] }}
            collectionName={defaultCollectionName}
            onClose={() => this.setState({ selectedItem: undefined })}
          />
        )}
      </div>
    );
  }
}
