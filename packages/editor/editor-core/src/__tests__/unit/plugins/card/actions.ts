import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';
import {
  remove as removeCard,
  visit as vistLink,
} from '../../../../plugins/card/toolbar';

import {
  doc,
  createEditorFactory,
  p,
  EditorTestCardProvider,
  inlineCard,
  blockCard,
} from '@atlaskit/editor-test-helpers';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next-types';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEventSignature;

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
      createAnalyticsEvent,
      editorProps: { allowAnalyticsGASV3: true },
    });
  };

  describe('actions', () => {
    describe('setProvider', () => {
      it('sets the card provider', () => {
        const { editorView } = editor(doc(p()));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: provider,
        });
      });
    });

    describe('queueCard', () => {
      it('queues a url', () => {
        const { editorView } = editor(doc(p()));
        const {
          dispatch,
          state: { tr },
        } = editorView;
        dispatch(
          queueCards([
            { url: 'http://www.atlassian.com/', pos: 24, appearance: 'inline' },
          ])(tr),
        );
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 24,
              appearance: 'inline',
            },
          ],
          provider: null,
        });
      });

      it('can queue the same url with different positions', () => {
        const { editorView } = editor(doc(p()));
        const { dispatch } = editorView;

        dispatch(
          queueCards([
            { url: 'http://www.atlassian.com/', pos: 24, appearance: 'inline' },
            { url: 'http://www.atlassian.com/', pos: 420, appearance: 'block' },
          ])(editorView.state.tr),
        );

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 24,
              appearance: 'inline',
            },
            {
              url: 'http://www.atlassian.com/',
              pos: 420,
              appearance: 'block',
            },
          ],
          provider: null,
        });
      });
    });

    describe('resolve', () => {
      it('eventually resolves the url from the queue', async () => {
        const { editorView } = editor(doc(p()));
        queueCards([
          { url: 'http://www.atlassian.com/', pos: 1, appearance: 'inline' },
        ])(editorView.state.tr);

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: null,
        });
      });
    });
  });

  describe.only('analytics GAS v3', () => {
    const linkTypes = [
      // {name: 'text', element: p},
      {
        name: 'inlineCard',
        element: inlineCard({ url: 'http://www.atlassian.com/' }),
      },
      {
        name: 'blockCard',
        element: blockCard({ url: 'http://www.atlassian.com/' }),
      },
      // {name: 'embed', element: p},
    ];

    linkTypes.forEach(type => {
      describe(`delete ${type.name}`, () => {
        it('via toobar', () => {
          const { editorView } = editor(doc(p('{<}', type.element('{>}'))));

          removeCard(editorView.state, editorView.dispatch);
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'deleted',
            actionSubject: 'link',
            attributes: { inputMethod: 'toolbar', displayMode: type.name },
            eventType: 'track',
          });
        });
      });
    });

    // describe('fires when deleted via toolbar', () => {

    //   it('triggers for text link', () => {
    //     const { editorView } = editor(
    //       doc(
    //         p(
    //           '{<}',
    //           inlineCard({
    //             data: {
    //               url: 'http://www.atlassian.com/',
    //             },
    //           })('{>}'),
    //         ),
    //       ),
    //     );

    //     removeCard(editorView.state, editorView.dispatch);
    //     expect(createAnalyticsEvent).toHaveBeenCalledWith({
    //       action: 'deleted',
    //       actionSubject: 'panel',
    //       attributes: { inputMethod: 'toolbar', displayMode: 'inlineCard' },
    //       eventType: 'track',
    //     });
    //   });
    // });
  });
});

// // @ts-ignore
// global.open = jest.fn();

// const { editorView, refs } = editor(
//   doc(
//     p(
//       '{<}',
//       inlineCard({
//         data: {
//           url: 'http://www.atlassian.com/',
//         },
//       })('{>}'),
//     ),
//   ),
// );

// setNodeSelection(editorView, refs['<']);

// const toolbar = floatingToolbar(editorView.state, intl);
// const visitButton = toolbar!.items.find(
//   item => item.type === 'button' && item.title === visitTitle,
// ) as FloatingToolbarButton<Command>;

// visitButton.onClick(editorView.state, editorView.dispatch);
// expect(open).toBeCalledWith('http://www.atlassian.com/', '_self');
