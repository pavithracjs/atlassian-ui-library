import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from './localUploadReact';

import { appendTimestamp } from '../util/appendTimestamp';
import { LocalFileSource, LocalFileWithSource } from '../service/types';
import { ClipboardConfig } from './types';

export const getFilesFromClipboard = (files: FileList) => {
  return Array.from(files).map(file => {
    if (file.type.indexOf('image/') === 0) {
      const name = appendTimestamp(file.name, (file as any).lastModified);
      return new File([file], name, {
        type: file.type,
      });
    } else {
      return file;
    }
  });
};

export interface ClipboardReactOwnProps {
  config: ClipboardConfig;
}

export type ClipboardReactProps = ClipboardReactOwnProps &
  LocalUploadComponentBaseProps;

const defaultConfig: ClipboardConfig = { uploadParams: {} };

export class ClipboardReact extends LocalUploadComponentReact<
  ClipboardReactProps
> {
  static defaultProps = {
    config: defaultConfig,
  };

  handleEvent = (event: Event): void => {
    const { clipboardData } = event as ClipboardEvent;

    if (clipboardData && clipboardData.files) {
      const fileSource =
        clipboardData.types.length === 1
          ? LocalFileSource.PastedScreenshot
          : LocalFileSource.PastedFile;
      const files: LocalFileWithSource[] = getFilesFromClipboard(
        clipboardData.files,
      ).map((file: File) => ({ file, source: fileSource }));
      this.uploadService.addFilesWithSource(files);
    }
  };

  componentDidMount() {
    document.addEventListener('paste', this.handleEvent);
  }
  componentWillUnmount() {
    document.removeEventListener('paste', this.handleEvent);
  }

  render() {
    return null;
  }
}
