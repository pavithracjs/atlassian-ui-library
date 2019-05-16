import { isClientBasedAuth } from '@atlaskit/media-core';

import {
  MediaClient,
  FileIdentifier,
  Identifier,
  isFileIdentifier,
} from '@atlaskit/media-client';
import { stringify } from 'query-string';
import { MediaCollectionItem } from '@atlaskit/media-store';

// We want to remove constructAuthTokenUrl and use mediaStore instead
// https://product-fabric.atlassian.net/browse/MSW-869
export async function constructAuthTokenUrl(
  url: string,
  mediaClient: MediaClient,
  collectionName?: string,
): Promise<string> {
  const auth = await mediaClient.config.authProvider({ collectionName });

  if (isClientBasedAuth(auth)) {
    return buildClientBasedUrl(
      auth.baseUrl,
      url,
      auth.token,
      auth.clientId,
      collectionName,
    );
  } else {
    return buildIssuerBasedUrl(
      auth.baseUrl,
      url,
      auth.token,
      auth.asapIssuer,
      collectionName,
    );
  }
}

function buildClientBasedUrl(
  host: string,
  url: string,
  token: string,
  client: string,
  collection?: string,
): string {
  return buildUrl(host, url, { client, collection, token });
}

function buildIssuerBasedUrl(
  host: string,
  url: string,
  token: string,
  issuer: string,
  collection?: string,
): string {
  return buildUrl(host, url, { issuer, collection, token });
}

function buildUrl(host: string, url: string, query: Object) {
  const separator = url.indexOf('?') > -1 ? '&' : '?';
  return `${host}${url}${separator}${stringify(query)}`;
}

export const toIdentifier = (
  item: MediaCollectionItem,
  collectionName: string,
): FileIdentifier => {
  return {
    id: item.id,
    mediaItemType: 'file',
    occurrenceKey: item.occurrenceKey,
    collectionName,
  };
};

// TODO MS-1752 - current implementation makes viewer navigation to misbehave
// if passed a file with the same id (with different occurrenceKeys) or with the same dataURI twice
export const getSelectedIndex = (
  items: Identifier[],
  selectedItem: Identifier,
) => {
  return items.findIndex(item => {
    if (isFileIdentifier(item) && isFileIdentifier(selectedItem)) {
      return item.id === selectedItem.id;
    }

    if (!isFileIdentifier(item) && !isFileIdentifier(selectedItem)) {
      return item.dataURI === selectedItem.dataURI;
    }

    return false;
  });
};
