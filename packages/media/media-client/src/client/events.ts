import { FileState } from '../models/file-state';

export type EventPayloadMap<P> = {
  readonly [event: string]: P;
};

export type EventPayloadListener<
  M extends EventPayloadMap<P>,
  E extends keyof M,
  P = any
> = (payload: M[E]) => void;

export interface AttachmentViewedEventPayload {
  fileId: string;
  viewingExperience:
    | 'minimal' // Smaller card was displayed
    | 'full' // Full resolution / video playback
    | 'download'; // Media was downloaded
}

export type UploadEventPayloadMap = {
  'file-added': FileState;
  'attachment-viewed': AttachmentViewedEventPayload;
};
