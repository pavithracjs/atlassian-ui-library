import { EditorPlugin } from '../../types';
import { confluenceInlineComment } from '@atlaskit/adf-schema';

const confluenceInlineCommentPlugin = (): EditorPlugin => ({
  marks() {
    return [
      {
        name: 'confluenceInlineComment',
        mark: confluenceInlineComment,
      },
    ];
  },
});

export default confluenceInlineCommentPlugin;
