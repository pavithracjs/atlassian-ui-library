import { name } from '../../../../version.json';
import { JSONDocNode } from '../../../../utils/index';
import { sanitizeNodeForPrivacy } from '../../../../utils/filter/privacy-filter';

describe(name, () => {
  describe('Utils -> filter -> privacy-filter', () => {
    describe('sanitizeNodeForPrivacy()', () => {
      it('should filter text attribute from all mention nodes from json document', () => {
        const jsonDoc = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'mention',
                  attrs: {
                    text: 'abc',
                    id: '123',
                  },
                },
                {
                  type: 'text',
                  text: ' Boo',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'mention',
                          attrs: {
                            id: '555',
                            text: '@Elaine Mattia',
                          },
                        },
                        {
                          type: 'text',
                          text: ' is great and nested',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        } as JSONDocNode;

        const sanitizedJSON = sanitizeNodeForPrivacy(jsonDoc);

        expect(sanitizedJSON).toEqual({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'mention',
                  attrs: {
                    text: '',
                    id: '123',
                  },
                },
                {
                  type: 'text',
                  text: ' Boo',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'mention',
                          attrs: {
                            id: '555',
                            text: '',
                          },
                        },
                        {
                          type: 'text',
                          text: ' is great and nested',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      });
    });
  });
});
