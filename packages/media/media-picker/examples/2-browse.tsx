// eslint-disable-line no-console
import * as React from 'react';
import { Component } from 'react';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { AuthEnvironment } from '../example-helpers/types';
import { FileState, ContextFactory, Context } from '@atlaskit/media-core';
import { UploadParams, BrowserConfig } from '../src';
import { Browser } from '../src/components/browserReact';

export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
  context?: Context;
  browseConfig?: BrowserConfig;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;
  private browserRef = React.createRef<Browser>();

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentDidMount() {
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

    context.on('file-added', this.onFileAdded);

    this.setState({
      context,
      browseConfig,
    });
  }

  onFileAdded = (fileState: FileState) => {
    console.log('onFileAdded', fileState);
  };

  onOpen = () => {
    if (this.browserRef && this.browserRef.current) {
      this.browserRef.current.browse();
    }
  };

  onCollectionChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const { innerText: collectionName } = e.currentTarget;
    const { browseConfig } = this.state;
    if (!browseConfig) {
      return;
    }

    const uploadParams: UploadParams = {
      collection: collectionName,
    };

    this.setState({
      collectionName,
      browseConfig: {
        ...browseConfig,
        uploadParams,
      },
    });
  };

  onAuthTypeChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const { innerText: authEnvironment } = e.currentTarget;

    this.setState({ authEnvironment: authEnvironment as AuthEnvironment });
  };

  render() {
    const {
      collectionName,
      authEnvironment,
      context,
      browseConfig,
    } = this.state;
    if (!browseConfig || !context) {
      return null;
    }

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
        <UploadPreviews>
          {({ onUploadsStart, onError, onPreviewUpdate }) => (
            <Browser
              ref={this.browserRef}
              context={context}
              config={browseConfig}
              onUploadsStart={onUploadsStart}
              onError={onError}
              onPreviewUpdate={onPreviewUpdate}
            />
          )}
        </UploadPreviews>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
