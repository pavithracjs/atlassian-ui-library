import { Fragment } from 'prosemirror-model';

export type MediaImageBase64 = {
  contentId: string;
  contentType: string;
  data: string;
};

export interface serializeFragmentWithAttachmentsResult {
  result: string | null;
  embeddedImages: MediaImageBase64[];
}

export interface Serializer<T> {
  serializeFragment(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
  ): T | null;

  serializeFragmentWithImages(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
  ): serializeFragmentWithAttachmentsResult | null;
}
