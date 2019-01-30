export default {
  props: {
    type: { type: 'enum', values: ['listItem'] },
    content: {
      type: 'array',
      items: [
        ['paragraph_with_no_marks', 'mediaSingle', 'codeBlock_with_no_marks'],
        [
          'paragraph_with_no_marks',
          'bulletList_with_no_marks',
          'mediaSingle',
          'codeBlock_with_no_marks',
          'orderedList_with_no_marks',
        ],
      ],
      minItems: 1,
    },
  },
};
