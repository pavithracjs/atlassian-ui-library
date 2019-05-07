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
  isOpen: boolean;
  onClose: () => void;
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

  componentDidMount() {
    // TODO: handle initial isOpen
  }

  componentWillReceiveProps(nextProps: BrowserReactProps) {
    const { isOpen } = this.props;
    const { isOpen: nextIsOpen } = nextProps;

    if (nextIsOpen && nextIsOpen !== isOpen) {
      this.browse();
    }
  }

  public browse(): void {
    const { onClose } = this.props;
    if (!this.browserRef.current) {
      return;
    }

    this.browserRef.current.click();
    // Calling onClose directly since there is no dom api to notify us when
    // the native file picker is closed
    onClose();
  }

  render() {
    const { config = defaultConfig } = this.props;
    const multiple = config.multiple;
    const fileExtensions =
      config.fileExtensions && config.fileExtensions.join(',');

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
