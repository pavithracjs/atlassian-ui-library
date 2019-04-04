import * as React from 'react';
import { Component } from 'react';
import { LocalUploadComponent } from './localUpload';
import { Context } from '@atlaskit/media-core';
import * as exenv from 'exenv';
import { Browser, BrowserConfig } from './types';
import { LocalUploadComponentReact } from './localUploadReact';

export interface BrowserReactProps {
  context: Context;
  config: BrowserConfig;
}

const defaultConfig: BrowserConfig = { uploadParams: {} };

export class BrowserReact extends LocalUploadComponentReact<BrowserReactProps> {
  private browseRef = React.createRef<HTMLInputElement>();

  private onFilePicked = () => {
    if (!this.browseRef.current) {
      return;
    }

    const filesArray = [].slice.call(this.browseRef.current.files);
    this.uploadService.addFiles(filesArray);
  };

  // TODO: automatically call this when rendering

  public browse(): void {
    if (!this.browseRef.current) {
      return;
    }
    this.browseRef.current.click();
  }

  render() {
    const { config = defaultConfig } = this.props;
    const multiple = config.multiple;
    const fileExtensions =
      config.fileExtensions && config.fileExtensions.join(',');

    return (
      <input
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={fileExtensions}
        onChange={this.onFilePicked}
      />
    );
  }
}
