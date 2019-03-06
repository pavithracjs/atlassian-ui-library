export default {
  props: {
    type: { type: 'enum', values: ['tableCell'] },
    attrs: {
      props: {
        colspan: { type: 'number', optional: true },
        rowspan: { type: 'number', optional: true },
        colwidth: {
          type: 'array',
          items: [{ type: 'number' }],
          optional: true,
        },
        background: { type: 'string', optional: true },
        defaultMarks: {
          type: 'array',
          items: [
            [
              'em',
              'code',
              'strike',
              'strong',
              'underline',
              'subsup',
              'textColor',
            ],
          ],
          forceContentValidation: true,
          optional: true,
        },
      },
      optional: true,
    },
    content: 'tableCell_content',
  },
  required: ['content'],
};
