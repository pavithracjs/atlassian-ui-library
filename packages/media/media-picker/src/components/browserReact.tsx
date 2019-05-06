import * as React from 'react';
import { ReactNode } from 'react';
import { BrowserConfig } from './types';
import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from './localUploadReact';

export type RenderBrowserFunc = () => ReactNode;
export interface BrowserReactOwnProps {
  config: BrowserConfig;
}

export type BrowserReactProps = BrowserReactOwnProps &
  LocalUploadComponentBaseProps;

const defaultConfig: BrowserConfig = { uploadParams: {} };

export class BrowserReact extends LocalUploadComponentReact<BrowserReactProps> {
  private browserRef = React.createRef<HTMLInputElement>();

  private onFilePicked = () => {
    if (!this.browserRef.current) {
      return;
    }

    const filesArray = [].slice.call(this.browserRef.current.files);
    this.uploadService.addFiles(filesArray);
  };

  // TODO: automatically call this when rendering

  public browse(): void {
    console.log('browse()', this.browserRef.current);
    if (!this.browserRef.current) {
      return;
    }
    this.browserRef.current.click();
  }

  render() {
    const { config = defaultConfig } = this.props;
    const multiple = config.multiple;
    const fileExtensions =
      config.fileExtensions && config.fileExtensions.join(',');
    console.log('BrowserReact render');
    return (
      <input
        ref={this.browserRef}
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={fileExtensions}
        onChange={this.onFilePicked}
      />
    );
  }
}
