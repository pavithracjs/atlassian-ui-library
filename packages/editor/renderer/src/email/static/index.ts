import * as icons from './icons';
import { IconName } from './icons';
import {
  SerializeFragmentWithAttachmentsResult,
  MediaImageBase64,
} from '../../serializer';

export * from './icons';

const cidPrefix = 'cid:pfcs-generated';
const cidMatcher = new RegExp(
  `src="cid:pfcs-generated-([\w]*)-([\w-]*)"`,
  'gi',
);
type ImageTypeString = 'icon';

export const createContentId = (
  imageName: icons.IconString,
  imageType: ImageTypeString = 'icon',
) => `${cidPrefix}-${imageType}-${imageName}`;

export const processEmbeddedImages = (isMockEnabled: boolean) => (
  result: string,
): SerializeFragmentWithAttachmentsResult => {
  const imageSet = new Set<icons.IconString>();

  const imageProcessor = (
    match: string,
    imageType: ImageTypeString,
    imageName: icons.IconString,
  ): string => {
    imageSet.add(imageName);
    const imageSource = (icons as any)[imageName];
    return isMockEnabled ? `src="${imageSource}"` : match;
  };

  const processedResult = result.replace(
    /src="cid:pfcs-generated-([\w]*)-([\w-]*)"/gi,
    imageProcessor,
  );

  const embeddedImagesMapper = (iconName: string): MediaImageBase64 => ({
    contentId: createContentId(IconName[iconName as icons.IconString]),
    contentType: 'png',
    data: (icons as any)[iconName],
  });

  return {
    result: processedResult,
    embeddedImages: [...imageSet].map(embeddedImagesMapper),
  };
};
