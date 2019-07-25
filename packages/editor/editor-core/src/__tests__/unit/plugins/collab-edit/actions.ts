import {
  createEditorFactory,
  doc,
  p,
  mention,
  unsupportedInline,
} from '@atlaskit/editor-test-helpers';
import { mention as mentionData } from '@atlaskit/util-data-test';
import { MentionProvider } from '@atlaskit/mention/resource';
import { ProviderFactory } from '@atlaskit/editor-common';

import { handleInit } from '../../../../plugins/collab-edit/actions';
import {
  InitData,
  CollabEditOptions,
} from '../../../../plugins/collab-edit/types';

const unknownNodesDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Valid! ',
          type: 'text',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://atlassian.net',
          },
        },
        {
          text: ' ',
          type: 'text',
        },
      ],
    },
  ],
  version: 1,
};

const privateContentNodesDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Bacon ',
          type: 'text',
        },
        {
          attrs: {
            id: '123',
            text: '@cheese',
          },
          type: 'mention',
        },
        {
          text: ' ham',
          type: 'text',
        },
      ],
    },
  ],
  version: 1,
};

describe('collab-edit: actions', () => {
  const createEditor = createEditorFactory();
  const mentionProvider: Promise<MentionProvider> = Promise.resolve(
    mentionData.storyData.resourceProvider,
  );
  const providerFactory = ProviderFactory.create({ mentionProvider });

  const editor = (
    doc: any,
    collabEdit?: CollabEditOptions,
    sanitizePrivateContent?: boolean,
  ) => {
    return createEditor({
      doc,
      editorProps: {
        allowUnsupportedContent: true,
        mentionProvider,
        collabEdit,
        sanitizePrivateContent,
      },
      providerFactory,
    });
  };

  describe('handleInit', () => {
    it('should wrap invalid nodes in unsupported when the allowUnsupportedContent option is enabled.', () => {
      const { editorView } = editor(doc(p('')));

      const initData: InitData = {
        doc: unknownNodesDoc,
      };

      handleInit(initData, editorView, { allowUnsupportedContent: true });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Valid! '),
          p(
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'inlineCard',
              },
            })(),
            ' ',
          ),
        ),
      );
    });

    it('should sanitize private content when the sanitizePrivateContent option is enabled.', () => {
      const collabEdit = {
        allowUnsupportedContent: true,
      };
      const { editorView } = editor(doc(p('')), collabEdit, true);

      const initData: InitData = {
        doc: privateContentNodesDoc,
      };

      handleInit(initData, editorView, collabEdit, providerFactory, true);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('Bacon ', mention({ id: '123', text: '' })(), ' ham')),
      );
    });

    it('should not sanitize private content when the sanitizePrivateContent option is disabled.', () => {
      const collabEdit = {
        allowUnsupportedContent: true,
      };
      const { editorView } = editor(doc(p('')), collabEdit, false);

      const initData: InitData = {
        doc: privateContentNodesDoc,
      };

      handleInit(initData, editorView, collabEdit, providerFactory, false);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('Bacon ', mention({ id: '123', text: '@cheese' })(), ' ham')),
      );
    });
  });
});
