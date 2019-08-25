import {
  MediaPicker,
  MediaFile,
  UploadPreviewUpdateEventPayload,
  UploadParams,
  UploadErrorEventPayload,
  isImagePreview,
  UploadProcessingEventPayload,
  Popup,
  PopupConfig,
} from '@atlaskit/media-picker';
import { MediaClientConfig } from '@atlaskit/media-core';

import { ErrorReportingHandler } from '@atlaskit/editor-common';

import {
  MediaState,
  CustomMediaPicker,
  MobileUploadEndEventPayload,
} from './types';

export type PickerType =
  | 'popup'
  | 'clipboard'
  | 'dropzone'
  | 'customMediaPicker';
export type ExtendedComponentConfigs = {
  popup: PopupConfig;
  customMediaPicker: CustomMediaPicker;
  dropzone: null;
  clipboard: null;
};

export type PickerFacadeConfig = {
  mediaClientConfig: MediaClientConfig;
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
  pickerType?: string,
) => void;

export default class PickerFacade {
  private picker?: Popup | CustomMediaPicker;
  private onDragListeners: Array<Function> = [];
  private errorReporter: ErrorReportingHandler;
  private pickerType: PickerType;
  private onStartListeners: Array<NewMediaEvent> = [];
  private eventListeners: Record<
    string,
    Array<MediaStateEventListener> | undefined
  > = {};
  private analyticsName: string | undefined;

  constructor(
    pickerType: PickerType,
    readonly config: PickerFacadeConfig,
    readonly pickerConfig?: ExtendedComponentConfigs[PickerType],
    readonly mediaPickerFactoryClass = MediaPicker,
    analyticsName?: string,
  ) {
    this.pickerType = pickerType;
    this.errorReporter = config.errorReporter;
    this.analyticsName = analyticsName;
  }

  async init(): Promise<PickerFacade> {
    let picker;
    if (this.pickerType === 'customMediaPicker') {
      picker = this.picker = this.pickerConfig as CustomMediaPicker;
    } else if (this.pickerType === 'popup') {
      picker = this.picker = await this.mediaPickerFactoryClass(
        this.config.mediaClientConfig,
        this.pickerConfig as PopupConfig,
      );
    }

    (picker as any).on('upload-preview-update', this.handleUploadPreviewUpdate);
    (picker as any).on('upload-processing', this.handleReady);
    // media picker not always fires upload-processing but always fires upload-end, and since handleReady() is idempotent it can be treated the same
    (picker as any).on('upload-end', this.handleReady);
    (picker as any).on('upload-error', this.handleUploadError);
    (picker as any).on('mobile-upload-end', this.handleMobileUploadEnd);

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
    (picker as any).removeAllListeners('upload-end');
    (picker as any).removeAllListeners('upload-error');

    this.onStartListeners = [];
    this.onDragListeners = [];

    try {
      if (this.pickerType === 'popup') {
        (picker as Popup).teardown();
      }
    } catch (ex) {
      this.errorReporter.captureException(ex);
    }
  }

  setUploadParams(params: UploadParams): void {
    if (this.picker) {
      this.picker.setUploadParams(params);
    }
  }

  onClose(cb: () => void): () => void {
    const { picker } = this;
    if (this.pickerType === 'popup') {
      const popupPicker = picker as Popup;
      popupPicker.on('closed', cb);

      return () => popupPicker.off('closed', cb);
    }

    return () => {};
  }

  show(): void {
    if (this.pickerType === 'popup') {
      try {
        (this.picker as Popup).show();
      } catch (ex) {
        this.errorReporter.captureException(ex);
      }
    }
  }

  hide(): void {
    if (this.pickerType === 'popup') {
      (this.picker as Popup).hide();
    }
  }

  onNewMedia(cb: NewMediaEvent) {
    this.onStartListeners.push(cb);
  }

  onDrag(cb: (state: 'enter' | 'leave') => any) {
    this.onDragListeners.push(cb);
  }

  public handleUploadPreviewUpdate = (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    const { file, preview } = event;
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
      cb(
        state,
        evt => this.subscribeStateChanged(file, evt),
        this.analyticsName || this.pickerType,
      ),
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

  public handleUploadError = ({ error }: UploadErrorEventPayload) => {
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

  public handleMobileUploadEnd = (event: MobileUploadEndEventPayload) => {
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

  public handleReady = (event: UploadProcessingEventPayload) => {
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
