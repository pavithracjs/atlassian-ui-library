import { LocalUploadComponent } from './localUpload';
import { MediaClient } from '@atlaskit/media-client';
import { AppProxyReactContext } from '../popup/components/app';
import { Dropzone, UploadEventPayloadMap, UploadParams } from '..';
import { UploadComponent, UploadEventEmitter } from './component';
import { EventEmitter } from '../util/eventEmitter';
import { InjectedIntl } from 'react-intl';

export interface LocalUploadConfig {
  uploadParams: UploadParams; // This is tenant upload params
  shouldCopyFileToRecents?: boolean;
}

export interface LocalUploadComponent<
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends UploadComponent<M> {
  cancel(uniqueIdentifier?: string): void;
  setUploadParams(uploadParams: UploadParams): void;
}

export interface BrowserConfig extends LocalUploadConfig {
  readonly multiple?: boolean;
  readonly fileExtensions?: Array<string>;
}

export interface BrowserConstructor {
  new (mediaClient: MediaClient, browserConfig: BrowserConfig): Browser;
}

export interface Browser extends LocalUploadComponent {
  browse(): void;
  teardown(): void;
}

export interface ClipboardConfig extends LocalUploadConfig {}

export interface ClipboardConstructor {
  new (mediaClient: MediaClient, clipboardConfig: ClipboardConfig): Clipboard;
}
export interface Clipboard extends LocalUploadComponent {
  activate(): Promise<void>;
  deactivate(): void;
}

export interface PopupConfig extends LocalUploadConfig {
  readonly container?: HTMLElement;
  readonly proxyReactContext?: AppProxyReactContext;
  readonly singleSelect?: boolean;
}

export interface PopupConstructor {
  new (mediaClient: MediaClient, config: PopupConfig): Popup;
}

export type PopupUploadEventPayloadMap = UploadEventPayloadMap & {
  readonly closed: undefined;
};

export interface PopupUploadEventEmitter extends UploadEventEmitter {
  emitClosed(): void;
}
export interface Popup
  extends UploadEventEmitter,
    EventEmitter<PopupUploadEventPayloadMap> {
  show(): Promise<void>;
  cancel(uniqueIdentifier?: string | Promise<string>): Promise<void>;
  teardown(): void;
  hide(): void;
  setUploadParams(uploadParams: UploadParams): void;
  emitClosed(): void;
}

export interface DropzoneReactContext {
  intl?: InjectedIntl;
}
export interface DropzoneConfig extends LocalUploadConfig {
  container?: HTMLElement;
  headless?: boolean;
  proxyReactContext?: DropzoneReactContext;
}

export interface DropzoneConstructor {
  new (mediaClient: MediaClient, dropzoneConfig: DropzoneConfig): Dropzone;
}

export interface DropzoneDragEnterEventPayload {
  length: number;
}

export interface DropzoneDragLeaveEventPayload {
  length: number;
}

export type DropzoneUploadEventPayloadMap = UploadEventPayloadMap & {
  readonly drop: undefined;
  readonly 'drag-enter': DropzoneDragEnterEventPayload;
  readonly 'drag-leave': DropzoneDragLeaveEventPayload;
};

export interface Dropzone
  extends LocalUploadComponent<DropzoneUploadEventPayloadMap> {
  activate(): Promise<void>;
  deactivate(): void;
}
