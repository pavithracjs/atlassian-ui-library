import * as React from 'react';
import { ReactNode } from 'react';
import { BrowserConfig } from '../types';
import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../localUploadReact';

export type RenderBrowserFunc = () => ReactNode;
export interface BrowserOwnProps {
  config: BrowserConfig;
  isOpen?: boolean;
  onClose?: () => void;
  /**
   * This prop will be mainly used for those contexts (like Editor) where there is no react lifecylce and we cannot rerender easily.
   * Otherwise, isOpen prop is prefered.
   */
  onBrowseFn?: (browse: () => void) => void;
  onCancelFn?: (cancel: (uploadId: string) => void) => void;
}

export type BrowserProps = BrowserOwnProps & LocalUploadComponentBaseProps;

const defaultConfig: BrowserConfig = { uploadParams: {} };

export class Browser extends LocalUploadComponentReact<BrowserProps> {
  private browserRef = React.createRef<HTMLInputElement>();

  static defaultProps = {
    config: defaultConfig,
  };

  private onFilePicked = () => {
    if (!this.browserRef.current) {
      return;
    }

    const filesArray = [].slice.call(this.browserRef.current.files);
    this.uploadService.addFiles(filesArray);
  };

  componentDidMount() {
    const { onBrowseFn, onCancelFn, isOpen } = this.props;

    if (onBrowseFn) {
      onBrowseFn(this.browse);
    }

    if (onCancelFn) {
      onCancelFn(this.cancel);
    }

    if (isOpen) {
      this.browse();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: BrowserProps) {
    const { isOpen } = this.props;
    const { isOpen: nextIsOpen } = nextProps;

    if (nextIsOpen && nextIsOpen !== isOpen) {
      this.browse();
    }
  }

  public browse: () => void = () => {
    const { onClose } = this.props;
    if (!this.browserRef.current) {
      return;
    }

    this.browserRef.current.click();
    // Calling onClose directly since there is no dom api to notify us when
    // the native file picker is closed
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { config } = this.props;
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
