import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema table node`, () => {
  const { tableHeader } = schema.nodes;

  describe('#tableHeader', () => {
    it('should sets cell attributes without defaultMarks', () => {
      const th = tableHeader.createAndFill();
      const html = toHTML(th!, schema);
      expect(html).toContain(
        '<th data-default-marks="[{&quot;type&quot;:&quot;strong&quot;}]"><p></p></th>',
      );
    });

    it('should sets cell attributes with defaultMarks', () => {
      const th = tableHeader.createAndFill({
        defaultMarks: [schema.marks.strong.create()],
      });
      const html = toHTML(th!, schema);

      expect(html).toContain(
        '<th data-default-marks="[{&quot;type&quot;:&quot;strong&quot;}]"><p></p></th>',
      );
    });

    it('should extract defaultMakrs from tableHeader', () => {
      const doc = fromHTML(
        '<table><tbody><tr><th data-default-marks="[{&quot;type&quot;:&quot;strong&quot;}]"></th></tr></tbody></table>',
        schema,
      );
      const tableHeaderDoc = doc.nodeAt(2);
      expect(tableHeaderDoc && tableHeaderDoc.type.name).toContain(
        'tableHeader',
      );

      const strongMarkLoaded =
        tableHeaderDoc && tableHeaderDoc.attrs.defaultMarks[0];
      expect(strongMarkLoaded.type).toEqual(schema.marks.strong.name);
    });
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'text',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
    ],
    marks: ['strong'],
  });
}
