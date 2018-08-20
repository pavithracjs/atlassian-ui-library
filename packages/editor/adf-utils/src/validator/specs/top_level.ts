export default {
  type: 'array',
  items: [
    [
      'paragraph',
      'bulletList',
      'mediaSingle',
      'orderedList',
      'heading',
      'panel',
      'blockquote',
      'rule',
      'codeBlock',
      'mediaGroup',
      'applicationCard',
      'decisionList',
      'taskList',
      'extension',
      'bodiedExtension',
      {
        props: {
          type: { type: 'enum', values: ['table'] },
          attrs: {
            props: {
              isNumberColumnEnabled: { type: 'boolean', optional: true },
              layout: {
                type: 'enum',
                values: ['wide', 'full-width', 'default'],
                optional: true,
              },
            },
            optional: true,
          },
          content: { type: 'array', items: ['tableRow'], minItems: 1 },
        },
      },
    ],
  ],
  minItems: 1,
};
