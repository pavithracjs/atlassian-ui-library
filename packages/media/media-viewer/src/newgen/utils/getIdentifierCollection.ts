import { isFileIdentifier, Identifier } from '@atlaskit/media-core';

export const getIdentifierCollection = (
  identifier: Identifier,
  defaultCollectionName: string,
): string | undefined =>
  isFileIdentifier(identifier)
    ? identifier.collectionName || defaultCollectionName
    : undefined;
