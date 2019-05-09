import { traverse } from '@atlaskit/adf-utils/traverse';

/*
export const selectors = {
  errorLoading: '.media-single .overlay.error',
};
*/

// 1px grey image
const greyImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
// const blackImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

/**
 * Cleanse ADF Media Nodes
 *
 * Converts media nodes to an inlined black image.
 *
 * This allows us to bypass a network request to the Media API,
 * which increases reliability in CI, and avoids mismatches via
 * authenticaton or incorrect identifiers (which ar environmental).
 *
 * @param adf An parsed ADF document
 */
export function cleanseAdfMedia(adf: any) {
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
