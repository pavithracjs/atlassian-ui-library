import {
  doc,
  createEditorFactory,
  p,
  a,
  createAnalyticsEventMock,
  Refs,
} from '@atlaskit/editor-test-helpers';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';
import { EditorView } from 'prosemirror-view';
import { visitLink, removeLink } from '../../../../plugins/hyperlink/commands';

describe('hyperlink', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEventInterface>;
  const targetUrl = 'http://www.google.com/';

  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const wrapper = createEditor({
      doc,
      createAnalyticsEvent: createAnalyticsEvent as any,
      editorProps: {
        allowAnalyticsGASV3: true,
      },
    });
    createAnalyticsEvent.mockClear();
    return wrapper;
  };

  describe('analytics v3', () => {
    describe(`from toolbar`, () => {
      let editorView: EditorView;
      let refs: Refs;

      beforeEach(() => {
        ({ editorView, refs } = editor(
          doc(p(a({ href: targetUrl })('Cool {pos}website '))),
        ));
      });

      it('visit', () => {
        visitLink(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'visited',
          actionSubject: 'link',
          actionSubjectId: 'text',
          eventType: 'track',
        });
      });

      it('delete', () => {
        removeLink(refs.pos)(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'deleted',
          actionSubject: 'link',
          eventType: 'track',
        });
      });
    });
  });
});
