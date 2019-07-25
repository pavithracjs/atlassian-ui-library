import { EditorPlugin } from '../../types';
import { annotation } from '@atlaskit/adf-schema';

const annotationPlugin = (): EditorPlugin => ({
  marks() {
    return [
      {
        name: 'annotation',
        mark: annotation,
      },
    ];
  },
});

export default annotationPlugin;
