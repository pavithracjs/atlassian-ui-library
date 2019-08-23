import {
  doc,
  p,
  defaultSchema,
  em,
  strike,
} from '@atlaskit/editor-test-helpers';
import { surroundingMarks } from '../../../../plugins/annotation/utils';

describe('annotation', () => {
  describe('surroundingMarks', () => {
    it('works for nodes on both sides, all marks', () => {
      const testDoc = doc(p(em('hello'), 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.em.create()],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes on both sides, after marks only', () => {
      const testDoc = doc(p('hello', 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after', () => {
      const testDoc = doc(p('al{<>}ex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after, start of node', () => {
      const testDoc = doc(p('{<>}alex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only before', () => {
      const testDoc = doc(p(strike('world'), 'al{<>}ex'))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.strike.create()],
        [],
      ]);
    });
  });
});
