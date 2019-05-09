import {
  MediaPicker,
  MediaPickerComponent,
  MediaPickerComponents,
  MediaFile,
  ComponentConfigs,
  UploadPreviewUpdateEventPayload,
  UploadEndEventPayload,
  UploadParams,
  UploadErrorEventPayload,
  isClipboard,
  isPopup,
  isBinaryUploader,
  isBrowser,
  isImagePreview,
} from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';

import { ErrorReportingHandler } from '@atlaskit/editor-common';

import {
  MediaState,
  CustomMediaPicker,
  MobileUploadEndEventPayload,
} from './types';

export type PickerType = keyof MediaPickerComponents | 'customMediaPicker';
export type ExtendedComponentConfigs = ComponentConfigs & {
  customMediaPicker: CustomMediaPicker;
};

export type PickerFacadeConfig = {
  context: Context;
  errorReporter: ErrorReportingHandler;
};

export type MediaStateEvent = MediaState;
export type MediaStateEventListener = (evt: MediaStateEvent) => void;

export type MediaStateEventSubscriber = ((
  listener: MediaStateEventListener,
) => void);
export type NewMediaEvent = (
  state: MediaState,
  onStateChanged: MediaStateEventSubscriber,
) => void;

export default class PickerFacade {
  private picker: MediaPickerComponent | CustomMediaPicker;
  private onDragListeners: Array<Function> = [];
  private errorReporter: ErrorReportingHandler;
  private pickerType: PickerType;
  private onStartListeners: Array<NewMediaEvent> = [];
  private eventListeners: Record<
    string,
    Array<MediaStateEventListener> | undefined
  > = {};

  constructor(
    pickerType: PickerType,
    readonly config: PickerFacadeConfig,
    readonly pickerConfig?: ExtendedComponentConfigs[PickerType],
    readonly mediaPickerFactoryClass = MediaPicker,
  ) {
    this.pickerType = pickerType;
    this.errorReporter = config.errorReporter;
  }

  async init(): Promise<PickerFacade> {
    let picker;
    if (this.pickerType === 'customMediaPicker') {
      picker = this.picker = this.pickerConfig as CustomMediaPicker;
    } else {
      picker = this.picker = await this.mediaPickerFactoryClass(
        this.pickerType,
        this.config.context,
        this.pickerConfig as any,
      );
    }

    (picker as any).on('upload-preview-update', this.handleUploadPreviewUpdate);
    (picker as any).on('upload-processing', this.handleReady);
    (picker as any).on('upload-error', this.handleUploadError);
    (picker as any).on('mobile-upload-end', this.handleMobileUploadEnd);

    if (isClipboard(picker)) {
      picker.activate();
    }

    return this;
  }

  get type() {
    return this.pickerType;
  }

  get mediaPicker() {
    return this.picker;
  }

  destroy() {
    const { picker } = this;

    if (!picker) {
      return;
    }

    (picker as any).removeAllListeners('upload-preview-update');
    (picker as any).removeAllListeners('upload-processing');
    (picker as any).removeAllListeners('upload-error');

    this.onStartListeners = [];
    this.onDragListeners = [];

    try {
      if (isClipboard(picker)) {
        picker.deactivate();
      }

      if (isPopup(picker) || isBrowser(picker)) {
        picker.teardown();
      }
    } catch (ex) {
      this.errorReporter.captureException(ex);
    }
  }

  setUploadParams(params: UploadParams): void {
    this.picker.setUploadParams(params);
  }

  onClose(cb: () => void): () => void {
    const { picker } = this;
    if (isPopup(picker)) {
      picker.on('closed', cb);

      return () => picker.off('closed', cb);
    }

    return () => {};
  }

  activate() {
    const { picker } = this;
    if (isClipboard(picker)) {
      picker.activate();
    }
  }

  deactivate() {
    const { picker } = this;
    if (isClipboard(picker)) {
      picker.deactivate();
    }
  }

  show(): void {
    if (isPopup(this.picker)) {
      try {
        this.picker.show();
      } catch (ex) {
        this.errorReporter.captureException(ex);
      }
    } else if (isBrowser(this.picker)) {
      this.picker.browse();
    }
  }

  hide(): void {
    if (isPopup(this.picker)) {
      this.picker.hide();
    }
  }

  upload(url: string, fileName: string): void {
    if (isBinaryUploader(this.picker)) {
      this.picker.upload(url, fileName);
    }
  }

  onNewMedia(cb: NewMediaEvent) {
    this.onStartListeners.push(cb);
  }

  onDrag(cb: (state: 'enter' | 'leave') => any) {
    this.onDragListeners.push(cb);
  }

  private handleUploadPreviewUpdate = (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    let { file, preview } = event;
    const { dimensions, scaleFactor } = isImagePreview(preview)
      ? preview
      : { dimensions: undefined, scaleFactor: undefined };
    const state: MediaState = {
      id: file.id,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      dimensions,
      scaleFactor,
    };

    this.eventListeners[file.id] = [];
    this.onStartListeners.forEach(cb =>
      cb(state, evt => this.subscribeStateChanged(file, evt)),
    );
  };

  private subscribeStateChanged = (
    file: MediaFile,
    onStateChanged: MediaStateEventListener,
  ) => {
    const subscribers = this.eventListeners[file.id];
    if (!subscribers) {
      return;
    }

    subscribers.push(onStateChanged);
  };

  private handleUploadError = ({ error }: UploadErrorEventPayload) => {
    if (!error || !error.fileId) {
      const err = new Error(
        `Media: unknown upload-error received from Media Picker: ${error &&
          error.name}`,
      );
      this.errorReporter.captureException(err);
      return;
    }

    const listeners = this.eventListeners[error.fileId];
    if (!listeners) {
      return;
    }

    listeners.forEach(cb =>
      cb({
        id: error.fileId!,
        status: 'error',
        error: error && { description: error.description, name: error.name },
      }),
    );

    // remove listeners
    delete this.eventListeners[error.fileId];
  };

  private handleMobileUploadEnd = (event: MobileUploadEndEventPayload) => {
    const { file } = event;

    const listeners = this.eventListeners[file.id];
    if (!listeners) {
      return;
    }

    listeners.forEach(cb =>
      cb({
        id: file.id,
        status: 'mobile-upload-end',
        fileMimeType: file.type,
        collection: file.collectionName,
        publicId: file.publicId,
      }),
    );
  };

  private handleReady = (event: UploadEndEventPayload) => {
    const { file } = event;

    const listeners = this.eventListeners[file.id];
    if (!listeners) {
      return;
    }

    listeners.forEach(cb =>
      cb({
        id: file.id,
        status: 'ready',
      }),
    );

    // remove listeners
    delete this.eventListeners[file.id];
  };
}
