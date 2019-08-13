import {
  createEditorFactory,
  date,
  p,
  status,
  td,
  mention,
  a,
  BuilderContent,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { compareNodes } from '../../../../../plugins/table/utils';
import { mention as mentionDataTest } from '@atlaskit/util-data-test';

enum CompareResult {
  greater = 'greater',
  less = 'less',
  equal = 'equal',
}

const compareResultToValue = {
  [CompareResult.greater]: 1,
  [CompareResult.equal]: 0,
  [CompareResult.less]: -1,
};

describe('Compare Nodes', () => {
  const createEditor = createEditorFactory();
  let editorView: EditorView;

  beforeAll(() => {
    ({ editorView } = createEditor({
      editorProps: {
        allowTables: true,
        allowStatus: true,
        allowDate: true,
        mentionProvider: Promise.resolve(
          mentionDataTest.storyData.resourceProvider,
        ),
      },
    }));
  });

  describe('Text node', () => {
    function testTextNodesComparison(
      cases: Array<[string, CompareResult, string]>,
    ) {
      /**
       * Table with the shape
       * Text nodeA | Text nodeB | result
       */
      test.each(cases)(
        `should node p('%s') be %s than node p('%s')`,
        (textA: string, expected: CompareResult, textB: string) => {
          const nodeA = td()(p(textA))(editorView.state.schema);
          const nodeB = td()(p(textB))(editorView.state.schema);

          expect(compareNodes(nodeA, nodeB)).toBe(
            compareResultToValue[expected],
          );
        },
      );
    }
    testTextNodesComparison([
      ['foo', CompareResult.greater, 'bar'],
      ['bar', CompareResult.less, 'foo'],
      ['foo', CompareResult.equal, 'foo'],
    ]);

    describe('use only the first word to compare', () => {
      testTextNodesComparison([
        ['foo bar', CompareResult.greater, 'bar foo'],
        ['bar foo', CompareResult.less, 'foo bar'],
        ['foo bar', CompareResult.equal, 'foo'],
        ['hello world', CompareResult.equal, 'hello universe'],
      ]);

      describe('use string comparison for complex numbers', () => {
        testTextNodesComparison([
          ['1.000.000$', CompareResult.less, '200.000$'],
          ['1000000$', CompareResult.greater, '1.000.000$'],
        ]);
      });

      describe('use number comparison when text start with a number', () => {
        testTextNodesComparison([
          ['99', CompareResult.less, '101'],
          ['105%', CompareResult.greater, '50% (TBD)'],
          ['5.10', CompareResult.greater, '5.09'],
        ]);
      });
    });
  });

  describe('Status inline node', () => {
    function testStatusNodeComparison(
      cases: Array<[string, CompareResult, string]>,
    ) {
      /**
       * Table with the shape
       * Text nodeA | Text nodeB | result
       */
      test.each(cases)(
        `should node p(status({ text: '%s' })) be %s than node p(status({ attrs: '%s' }))`,
        (textA: string, expected: CompareResult, textB: string) => {
          const nodeA = td()(
            p(status({ text: textA, color: '#FFF', localId: 'a' })),
          )(editorView.state.schema);
          const nodeB = td()(
            p(status({ text: textB, color: '#FFF', localId: 'b' })),
          )(editorView.state.schema);

          expect(compareNodes(nodeA, nodeB)).toBe(
            compareResultToValue[expected],
          );
        },
      );
    }

    testStatusNodeComparison([
      ['done', CompareResult.less, 'invalid'],
      ['invalid', CompareResult.greater, 'done'],
      ['done', CompareResult.equal, 'done'],
    ]);
  });

  describe('Date inline node', () => {
    test.each(
      [
        [new Date('2019-01-01'), CompareResult.equal, new Date('2019-01-01')],
        [new Date('2019-01-01'), CompareResult.greater, new Date('2018-01-01')],
        [new Date('2018-01-01'), CompareResult.less, new Date('2019-01-01')],
        [new Date('2019-02-01'), CompareResult.greater, new Date('2019-01-01')],
        [new Date('2019-01-01'), CompareResult.less, new Date('2019-02-01')],
        [new Date('2019-01-02'), CompareResult.greater, new Date('2019-01-01')],
        [new Date('2019-01-01'), CompareResult.less, new Date('2019-01-02')],
      ].map(([dateA, result, dateB]) => [
        (dateA as Date).getTime(),
        result,
        (dateB as Date).getTime(),
      ]),
    )(
      `should node p(date({ timestamp: '%d' })) be %s than node p(date({ timestamp: '%d' }))`,
      (timestampA: number, expected: CompareResult, timestampB: number) => {
        const nodeA = td()(p(date({ timestamp: timestampA })))(
          editorView.state.schema,
        );
        const nodeB = td()(p(date({ timestamp: timestampB })))(
          editorView.state.schema,
        );

        expect(compareNodes(nodeA, nodeB)).toBe(compareResultToValue[expected]);
      },
    );
  });

  describe('Mention inline node', () => {
    test.each([
      ['awood', CompareResult.less, 'Carolyn'],
      ['Carolyn', CompareResult.greater, 'awood'],
      ['John Doe', CompareResult.greater, 'Jane Doe'],
      ['John Doe', CompareResult.equal, 'John Doe'],
      ['John Doe', CompareResult.less, 'John Smith'],
      ['John Doe', CompareResult.greater, undefined],
      ['John Doe', CompareResult.greater, undefined],
    ])(
      `should node p(mention({ text: '%s' })) be %s than node p(mention({ text: '%s' }))`,
      (
        textA: string | undefined,
        expected: CompareResult,
        textB: string | undefined,
      ) => {
        const nodeA = td()(p(mention({ id: 'a', text: textA })()))(
          editorView.state.schema,
        );
        const nodeB = td()(p(mention({ id: 'b', text: textB })()))(
          editorView.state.schema,
        );

        expect(compareNodes(nodeA, nodeB)).toBe(compareResultToValue[expected]);
      },
    );
  });

  describe('Link inline node', () => {
    test.each([
      ['http://google.com', CompareResult.less, 'http://yahoo.com'],
      ['Google Url', CompareResult.greater, 'Google Link'],
    ])(
      `should node p(link(any)('%s')) be %s than node p(link(any)('%s'))`,
      (textLinkA: string, expected: CompareResult, textLinkB: string) => {
        const nodeA = td()(p(a({ href: '' })(textLinkA)))(
          editorView.state.schema,
        );
        const nodeB = td()(p(a({ href: '' })(textLinkB)))(
          editorView.state.schema,
        );

        expect(compareNodes(nodeA, nodeB)).toBe(compareResultToValue[expected]);
      },
    );
  });

  describe('Compare mixed content', () => {
    function testMixedNodesComparison(
      cases: Array<[BuilderContent, CompareResult, BuilderContent]>,
    ) {
      test.each(cases)(
        `should node a %p be %s than node b %p`,
        (a: BuilderContent, expected: CompareResult, b: BuilderContent) => {
          const nodeA = td()(a)(editorView.state.schema);
          const nodeB = td()(b)(editorView.state.schema);

          expect(compareNodes(nodeA, nodeB)).toBe(
            compareResultToValue[expected],
          );
        },
      );
    }

    testMixedNodesComparison([
      [p('10'), CompareResult.less, p('a1')],
      [p('10'), CompareResult.less, p(mention({ id: 'a', text: '10' })())],
      [
        p('10'),
        CompareResult.less,
        p(date({ timestamp: new Date('2019-01-01').getTime() })),
      ],
      [
        p('10'),
        CompareResult.less,
        p(status({ text: '10', color: '#FFF', localId: 'a' })),
      ],
      [p('10'), CompareResult.less, p(a({ href: '' })('10'))],

      [p('a1'), CompareResult.less, p(mention({ id: 'a', text: 'a1' })())],
      [
        p('a1'),
        CompareResult.less,
        p(date({ timestamp: new Date('2019-01-01').getTime() })),
      ],
      [
        p('a1'),
        CompareResult.less,
        p(status({ text: 'a1', color: '#FFF', localId: 'a' })),
      ],
      [p('a1'), CompareResult.less, p(a({ href: '' })('10'))],

      [
        p(mention({ id: 'a', text: 'a1' })()),
        CompareResult.less,
        p(date({ timestamp: new Date('2019-01-01').getTime() })),
      ],
      [
        p(mention({ id: 'a', text: 'a1' })()),
        CompareResult.less,
        p(status({ text: 'a1', color: '#FFF', localId: 'a' })),
      ],
    ]);
  });
});
