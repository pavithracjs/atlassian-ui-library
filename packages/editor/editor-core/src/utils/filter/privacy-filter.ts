import { traverse, ADFEntity } from '@atlaskit/adf-utils';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from 'prosemirror-model';

/**
 * Sanitises a document for a collaborative editing use case
 * where some content should not be in the document (e.g. mention names).
 *
 * It is expected that these names we be resolved separately (e.g. when rendering
 * a node view).
 */
export function sanitizeNodeForPrivacy(json: JSONDocNode): JSONDocNode {
  const sanitizedJSON = traverse(json as any, {
    mention: node => {
      return {
        ...node,
        text: '',
      };
    },
  }) as JSONDocNode;

  console.log('sanitized', JSON.stringify(sanitizedJSON, null, 2));

  return sanitizedJSON;
}
