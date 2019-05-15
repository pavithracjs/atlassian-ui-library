// eslint-disable-line no-console
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { MediaPicker, Browser, UploadParams, BrowserConfig } from '../src';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { AuthEnvironment } from '../example-helpers/types';
import { MediaClient, FileState } from '@atlaskit/media-client';

export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
  fileBrowser?: Browser;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  async componentWillMount() {
    await this.createBrowse();
  }

  async createBrowse() {
    const mediaClient = new MediaClient({
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
    if (this.state.fileBrowser) {
      this.state.fileBrowser.teardown();
    }
    const fileBrowser = await MediaPicker('browser', mediaClient, browseConfig);

    mediaClient.on('file-added', this.onFileAdded);
    this.setState({
      fileBrowser,
    });
  }

  onFileAdded = (fileState: FileState) => {
    console.log('onFileAdded', fileState);
  };

  onOpen = () => {
    const { fileBrowser } = this.state;
    if (fileBrowser) {
      fileBrowser.browse();
    }
  };

  onCollectionChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const { innerText: collectionName } = e.currentTarget;
    const { fileBrowser } = this.state;
    if (!fileBrowser) {
      return;
    }

    this.setState({ collectionName }, () => {
      fileBrowser.setUploadParams({
        collection: collectionName,
      });
    });
  };

  onAuthTypeChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const { innerText: authEnvironment } = e.currentTarget;

    this.setState({ authEnvironment: authEnvironment as AuthEnvironment });
  };

  render() {
    const { collectionName, authEnvironment, fileBrowser } = this.state;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onOpen}>
            Open
          </Button>
          <DropdownMenu trigger={collectionName} triggerType="button">
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultMediaPickerCollectionName}
            </DropdownItem>
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultCollectionName}
            </DropdownItem>
          </DropdownMenu>
          <DropdownMenu trigger={authEnvironment} triggerType="button">
            <DropdownItem onClick={this.onAuthTypeChange}>client</DropdownItem>
            <DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
          </DropdownMenu>
        </PopupHeader>
        {fileBrowser ? <UploadPreviews picker={fileBrowser} /> : null}
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
