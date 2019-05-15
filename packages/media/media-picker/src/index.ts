export {
  DropzoneUploadEventPayloadMap,
  PopupUploadEventPayloadMap,
} from './components/types';

import {
  Browser,
  BrowserConfig,
  BrowserConstructor,
  ClipboardConstructor,
  ClipboardConfig,
  Clipboard,
  Popup,
  PopupConfig,
  PopupConstructor,
  DropzoneConfig,
  DropzoneConstructor,
  Dropzone,
} from './components/types';

import { MediaClient } from '@atlaskit/media-client';

export const isBrowser = (component: any): component is Browser =>
  component && 'browse' in component && 'teardown' in component;
export const isClipboard = (component: any): component is Clipboard =>
  component && 'activate' in component && 'deactivate' in component;
export const isDropzone = (component: any): component is Dropzone =>
  component && 'activate' in component && 'deactivate' in component;
export const isPopup = (component: any): component is Popup =>
  component &&
  ['show', 'cancel', 'teardown', 'hide'].every(
    (prop: string) => prop in component,
  );

// Events public API and types
export {
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  isImagePreview,
} from './domain/uploadEvent';

export { MediaFile } from './domain/file';
export { MediaProgress } from './domain/progress';
export { MediaError } from './domain/error';
export { ImagePreview, Preview, NonImagePreview } from './domain/preview';

// Constructor public API and types
export interface MediaPickerConstructors {
  browser: BrowserConstructor;
  clipboard: ClipboardConstructor;
  dropzone: DropzoneConstructor;
  popup: PopupConstructor;
}

export { Browser, Clipboard, Dropzone, Popup };
export type MediaPickerComponent = Browser | Clipboard | Dropzone | Popup;

export interface MediaPickerComponents {
  browser: Browser;
  clipboard: Clipboard;
  dropzone: Dropzone;
  popup: Popup;
}

export { UploadParams } from './domain/config';

export { BrowserConfig, DropzoneConfig, PopupConfig, ClipboardConfig };
export interface ComponentConfigs {
  browser: BrowserConfig;
  clipboard: ClipboardConfig;
  dropzone: DropzoneConfig;
  popup: PopupConfig;
}

export {
  BrowserConstructor,
  ClipboardConstructor,
  DropzoneConstructor,
  PopupConstructor,
};

export async function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  mediaClient: MediaClient,
  pickerConfig?: ComponentConfigs[K],
): Promise<MediaPickerComponents[K]> {
  switch (componentName) {
    case 'browser':
      const {
        BrowserImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-browser" */ './components/browser');
      return new BrowserImpl(mediaClient, pickerConfig as
        | BrowserConfig
        | undefined);
    case 'clipboard':
      const {
        ClipboardImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-clipboard" */ './components/clipboard');
      return new ClipboardImpl(mediaClient, pickerConfig as
        | ClipboardConfig
        | undefined);
    case 'dropzone':
      const {
        DropzoneImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-dropzone" */ './components/dropzone');
      return new DropzoneImpl(mediaClient, pickerConfig as
        | DropzoneConfig
        | undefined);
    case 'popup':
      const {
        PopupImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup');
      return new PopupImpl(mediaClient, pickerConfig as PopupConfig);
    default:
      throw new Error(`The component ${componentName} does not exist`);
  }
}
