import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';
import { removeCard, visitCardLink } from '../../../../plugins/card/toolbar';

import {
  doc,
  createEditorFactory,
  p,
  EditorTestCardProvider,
  inlineCard,
  blockCard,
  a,
  createAnalyticsEventMock,
  Refs,
} from '@atlaskit/editor-test-helpers';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';
import { setNodeSelection } from '../../../../utils';
import { EditorView } from 'prosemirror-view';
import { AnalyticsHandler } from '../../../../analytics';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEventInterface>;
  let trackEvent: AnalyticsHandler;

  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const wrapper = createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
      createAnalyticsEvent: createAnalyticsEvent as any,
      editorProps: { allowAnalyticsGASV3: true, analyticsHandler: trackEvent },
    });
    createAnalyticsEvent.mockClear();
    return wrapper;
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

  describe.only('analytics', () => {
    const atlassianUrl = 'http://www.atlassian.com/';
    const linkTypes = [
      {
        name: 'text',
        element: p(a({ href: atlassianUrl })('>'), 'Cool {<>}website '),
      },
      {
        name: 'inlineCard',
        element: p('{<}', inlineCard({ url: atlassianUrl })('{>}')),
      },
      {
        name: 'blockCard',
        element: blockCard({ url: atlassianUrl })(),
      },
    ];

    linkTypes.forEach(type => {
      describe(`Toolbar ${type.name}`, () => {
        let editorView: EditorView;
        let refs: Refs;

        beforeEach(() => {
          ({ editorView, refs } = editor(doc(type.element)));
          if (type.name === 'blockCard') {
            setNodeSelection(editorView, 0);
          } else {
            setNodeSelection(editorView, refs['<']);
          }

          trackEvent = jest.fn();
        });

        describe('delete command', () => {
          it('should create analytics V3 event', () => {
            removeCard(editorView.state, editorView.dispatch);
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'deleted',
              actionSubject: 'link',
              attributes: { inputMethod: 'toolbar', displayMode: type.name },
              eventType: 'track',
            });
          });

          it('should track analytics V2 event', () => {
            removeCard(editorView.state, editorView.dispatch);
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.card.delete.button',
            );
          });
        });

        describe('visit command', () => {
          let windowSpy: jest.MockInstance<any>;
          beforeEach(() => {
            windowSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
          });

          afterEach(() => {
            windowSpy.mockRestore();
          });

          it('should create analytics V3 event', () => {
            visitCardLink(editorView.state, editorView.dispatch);
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'visited',
              actionSubjectId: type.name,
              actionSubject: 'link',
              eventType: 'track',
            });
          });

          it('should track anaytlics V2 event', () => {
            visitCardLink(editorView.state, editorView.dispatch);
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.card.visit.button',
            );
          });

          it('should open a new tab with the right url', () => {
            expect(windowSpy).toHaveBeenCalledWith(atlassianUrl);
          });
        });
      });
    });
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
