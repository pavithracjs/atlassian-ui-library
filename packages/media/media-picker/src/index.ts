export { PopupUploadEventPayloadMap } from './components/types';

import {
  Browser,
  BrowserConfig,
  BrowserConstructor,
  ClipboardConfig,
  DropzoneConfig,
  Popup,
  PopupConfig,
  PopupConstructor,
} from './components/types';

import { Context } from '@atlaskit/media-core';

export const isBrowser = (component: any): component is Browser =>
  component && 'browse' in component && 'teardown' in component;
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
  popup: PopupConstructor;
}

export { Browser, Popup };
export type MediaPickerComponent = Browser | Popup;

export interface MediaPickerComponents {
  browser: Browser;
  popup: Popup;
}

export { UploadParams } from './domain/config';
export { BrowserConfig, PopupConfig, ClipboardConfig, DropzoneConfig };
export interface ComponentConfigs {
  browser: BrowserConfig;
  popup: PopupConfig;
}

export { BrowserConstructor, PopupConstructor };

export async function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  context: Context,
  pickerConfig?: ComponentConfigs[K],
): Promise<MediaPickerComponents[K]> {
  switch (componentName) {
    case 'browser':
      const {
        BrowserImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-browser" */ './components/browser');
      return new BrowserImpl(context, pickerConfig as
        | BrowserConfig
        | undefined);
    case 'popup':
      const {
        PopupImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup');
      return new PopupImpl(context, pickerConfig as PopupConfig);
    default:
      throw new Error(`The component ${componentName} does not exist`);
  }
}

// REACT COMPONENTS

export { default as Dropzone } from './components/dropzoneReactLoader';
export { ClipboardLoader as Clipboard } from './components/clipboard';
