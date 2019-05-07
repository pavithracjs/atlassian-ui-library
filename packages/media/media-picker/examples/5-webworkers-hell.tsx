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
  BrowserConfig,
  UploadPreviewUpdateEventPayload,
} from '../src';
import {
  PreviewsWrapper,
  PopupHeader,
  PopupContainer,
  PreviewsTitle,
} from '../example-helpers/styled';
import { UploadPreview } from '../example-helpers/upload-preview';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  previewsData: any[];
  isOpen: boolean;
}

const context = ContextFactory.create({
  authProvider: mediaPickerAuthProvider(),
});

const browseConfig: BrowserConfig = {
  multiple: true,
  fileExtensions: ['image/jpeg', 'image/png'],
  uploadParams: {
    collection: defaultMediaPickerCollectionName,
  },
};

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  browserComponents: Browser[] = [];
  dropzoneContainer?: HTMLDivElement;

  state: BrowserWrapperState = {
    previewsData: [],
    isOpen: false,
  };

  renderBrowser = () => {
    const { isOpen } = this.state;

    return (
      <Browser
        context={context}
        config={browseConfig}
        isOpen={isOpen}
        onClose={this.onClose}
        onPreviewUpdate={this.onUploadPreviewUpdate}
      />
    );
  };

  onUploadPreviewUpdate = (data: UploadPreviewUpdateEventPayload) => {
    this.setState({ previewsData: [...this.state.previewsData, data] });
  };

  onOpen = (fileBrowser: Browser) => () => {
    fileBrowser.browse();
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  private renderPreviews = () => {
    const { previewsData } = this.state;

    return previewsData.map((previewsData, index) => (
      <UploadPreview key={`${index}`} fileId={previewsData.fileId} />
    ));
  };

  render() {
    const buttons = this.browserComponents.map((browser, key) => {
      return (
        <Button key={key} appearance="primary" onClick={this.onOpen(browser)}>
          Open
        </Button>
      );
    });
    const browsers = (Array(5) as any).fill().map(this.renderBrowser());

    return (
      <PopupContainer>
        <PopupHeader>{buttons}</PopupHeader>
        <PreviewsWrapper>
          <PreviewsTitle>Upload previews</PreviewsTitle>
          {this.renderPreviews()}
          {browsers}
        </PreviewsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
