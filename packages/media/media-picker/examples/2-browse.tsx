// eslint-disable-line no-console
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import {
  Browser,
  UploadParams,
  BrowserConfig,
  UploadsStartEventPayload,
} from '../src';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import {
  ContextFactory,
  FileState,
  FileIdentifier,
} from '@atlaskit/media-core';
import { Card } from '../../media-card';

export interface BrowserWrapperState {
  isOpen: boolean;
  fileIds: string[];
}

const context = ContextFactory.create({
  authProvider: mediaPickerAuthProvider(),
});
const uploadParams: UploadParams = {
  collection: defaultMediaPickerCollectionName,
};
const browseConfig: BrowserConfig = {
  multiple: true,
  fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
  uploadParams,
};

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  state: BrowserWrapperState = {
    isOpen: false,
    fileIds: [],
  };

  componentWillMount() {
    context.on('file-added', this.onFileAdded);
  }

  onFileAdded = (_: FileState) => {
    // console.log('onFileAdded', fileState);
  };

  onOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onUploadsStart = (payload: UploadsStartEventPayload) => {
    const { files } = payload;
    const newFileIds = files.map(file => file.id);
    console.log({ newFileIds });
    this.setState({ fileIds: [...this.state.fileIds, ...newFileIds] });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  renderCards = () => {
    const { fileIds } = this.state;

    return fileIds.map(id => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
      };

      return <Card key={id} context={context} identifier={identifier} />;
    });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onOpen}>
            Open
          </Button>
        </PopupHeader>
        {this.renderCards()}
        <Browser
          isOpen={isOpen}
          context={context}
          config={browseConfig}
          onUploadsStart={this.onUploadsStart}
          onClose={this.onClose}
        />
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
