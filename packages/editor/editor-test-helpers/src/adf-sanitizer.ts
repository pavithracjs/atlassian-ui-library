import { traverse } from '@atlaskit/adf-utils/traverse';

// 1px grey image
const greyImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
// const blackImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

/**
 * Parses an ADF document and converts media nodes to an inlined image.
 *
 * * Bypasses a network request to the Media APIs.
 * * Removes environmental dependency for matching IDs and authentication.
 * * Improves reliability in CI environment.
 *
 * @param adf An parsed ADF document
 */
export function parseAndInlineAdfMedia(adf: any): any {
  // Deep copy clone just in case the original state is needed later
  adf = JSON.parse(JSON.stringify(adf));
  const cleansedAdf = traverse(adf, {
    media: (node: any) => {
      const { attrs } = node;
      if (node.type === 'media' && attrs.type !== 'external') {
        // Instead of looking up the url by resolving the ID at runtime
        // we set an external url for immediate access.
        attrs.type = 'external';
        attrs.url = greyImage;
      }
      return node;
    },
  });
  return cleansedAdf;
}
