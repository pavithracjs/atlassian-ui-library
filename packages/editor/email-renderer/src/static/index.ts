import * as icons from './icons';
import { IconName } from './icons';
import {
  SerializeFragmentWithAttachmentsResult,
  MediaImageBase64,
} from '../serializer';

export * from './icons';

const cidPrefix = 'cid:pfcs-generated';
const cidMatcher = new RegExp(`src="${cidPrefix}-([\\w]*)-([\\w-]*)"`, 'gi');
type ImageTypeString = 'icon';

export const createContentId = (
  imageName: icons.IconString,
  imageType: ImageTypeString = 'icon',
) => `${cidPrefix}-${imageType}-${imageName}`;

const embeddedImagesMapper = (iconName: string): MediaImageBase64 => ({
  contentId: createContentId(IconName[iconName as icons.IconString]),
  contentType: 'png',
  data: (icons as any)[iconName],
});

export const processEmbeddedImages = (isMockEnabled: boolean) => (
  result: string,
): SerializeFragmentWithAttachmentsResult => {
  const imageSet = new Set<icons.IconString>();

  const imageProcessor = (
    match: string,
    imageType: ImageTypeString,
    imageName: icons.IconString,
  ): string => {
    // Inline the image if mock is enabled
    if (isMockEnabled) {
      return `src="${(icons as any)[imageName]}"`;
    }

    // Otherwise, do not do a replacement (keep the cid as the src), and add the image to the set.
    imageSet.add(imageName);
    return match;
  };

  const processedResult = result.replace(cidMatcher, imageProcessor);

  return {
    result: processedResult,
    embeddedImages: [...imageSet].map(embeddedImagesMapper),
  };
};
