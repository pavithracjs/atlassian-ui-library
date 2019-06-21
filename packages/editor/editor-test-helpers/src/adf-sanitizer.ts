import { traverse, find, ADFEntity } from '@atlaskit/adf-utils';

// 1px grey image
const placeholderImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

/**
 * Parses an ADF document and converts media nodes to an external image with URL
 * pointing to an inlined mage, this has the benefit of improving reliability of VR tests,
 * especially in CI because it:
 * * Bypasses a network request to the Media APIs
 * * Removes environmental dependency for matching IDs and authentication
 *
 * @param adf An ADF object or a stringified ADF object
 */
export function parseAndInlineAdfMedia(adf: Object | string): Object {
  if (typeof adf === 'string') {
    adf = JSON.parse(adf);
  } else {
    // Deep copy clone just in case the original state is needed later
    adf = JSON.parse(JSON.stringify(adf));
  }

  if (!containsMedia(adf)) {
    return adf;
  }

  return traverse(adf as ADFEntity, {
    media: (node: any) => {
      const { attrs } = node;
      if (attrs.type !== 'external') {
        attrs.type = 'external';
      }
      attrs.url = placeholderImage;
      return node;
    },
  });
}

function containsMedia(adf: Object): boolean {
  return !!find(
    adf as ADFEntity,
    (node: ADFEntity) => !!(node.type === 'media'),
  );
}
