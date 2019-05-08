import { Component } from 'react';
import { Context } from '@atlaskit/media-core';
import { UploadService } from '../service/types';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadEventPayloadMap,
} from '../domain/uploadEvent';
import { UploadComponent } from './component';
import { UploadParams } from '../domain/config';
import { NewUploadServiceImpl } from '../service/newUploadServiceImpl';
import { LocalUploadConfig } from './types';

/**
 * export class LocalUploadComponentReact<
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends UploadComponent<M> implements LocalUploadComponentReact {
 */

// export interface LocalUploadComponentReactProps {
//   context: Context;
//   config: LocalUploadConfig;
// }

export type LocalUploadComponentBaseProps = {
  context: Context;
  config: LocalUploadConfig;
  onUploadsStart?: (payload: UploadsStartEventPayload) => void;
  onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
  onStatusUpdate?: (payload: UploadStatusUpdateEventPayload) => void;
  onProcessing?: (payload: UploadProcessingEventPayload) => void;
  onEnd?: (payload: UploadEndEventPayload) => void;
  onError?: (payload: UploadErrorEventPayload) => void;
  // item: FileState;
  // collectionName?: string;
};

export class LocalUploadComponentReact<
  Props extends LocalUploadComponentBaseProps,
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends Component<Props, {}> {
  protected readonly uploadService: UploadService;
  // protected config: LocalUploadConfig;
  protected uploadComponent = new UploadComponent<M>();

  constructor(props: Props) {
    super(props);

    const {
      context,
      config,
      onUploadsStart,
      onPreviewUpdate,
      onStatusUpdate,
      onProcessing,
      onEnd,
      onError,
    } = this.props;
    const tenantUploadParams = config.uploadParams;
    const { shouldCopyFileToRecents = true } = config;

    if (onUploadsStart) {
      this.uploadComponent.on('uploads-start', onUploadsStart!);
    }
    if (onPreviewUpdate) {
      this.uploadComponent.on('upload-preview-update', onPreviewUpdate!);
    }
    if (onStatusUpdate) {
      this.uploadComponent.on('upload-status-update', onStatusUpdate!);
    }
    if (onProcessing) {
      this.uploadComponent.on('upload-processing', onProcessing!);
    }
    if (onEnd) {
      this.uploadComponent.on('upload-end', onEnd!);
    }
    if (onError) {
      this.uploadComponent.on('upload-error', onError!);
    }

    this.uploadService = new NewUploadServiceImpl(
      context,
      tenantUploadParams,
      shouldCopyFileToRecents,
    );
    // this.config = config;
    this.uploadService.on('files-added', this.onFilesAdded);
    this.uploadService.on('file-preview-update', this.onFilePreviewUpdate);
    this.uploadService.on('file-uploading', this.onFileUploading);
    this.uploadService.on('file-converting', this.onFileConverting);
    this.uploadService.on('file-converted', this.onFileConverted);
    this.uploadService.on('file-upload-error', this.onUploadError);
  }

  public cancel(uniqueIdentifier?: string): void {
    this.uploadService.cancel(uniqueIdentifier);
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadService.setUploadParams(uploadParams);
  }

  private onFilesAdded = ({ files }: UploadsStartEventPayload): void => {
    this.uploadComponent.emitUploadsStart(files);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: UploadPreviewUpdateEventPayload): void => {
    this.uploadComponent.emitUploadPreviewUpdate(file, preview);
  };

  private onFileUploading = ({
    file,
    progress,
  }: UploadStatusUpdateEventPayload): void => {
    this.uploadComponent.emitUploadProgress(file, progress);
  };

  private onFileConverting = ({ file }: UploadProcessingEventPayload): void => {
    this.uploadComponent.emitUploadProcessing(file);
  };

  private onFileConverted = (payload: UploadEndEventPayload): void => {
    this.uploadComponent.emitUploadEnd(payload.file, payload.public);
  };

  private onUploadError = ({ file, error }: UploadErrorEventPayload): void => {
    this.uploadComponent.emitUploadError(file, error);
  };
}
