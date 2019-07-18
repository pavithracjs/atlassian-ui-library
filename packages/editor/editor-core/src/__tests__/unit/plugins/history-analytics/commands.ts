import {
  createEditorFactory,
  doc,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import * as commands from '../../../../plugins/history-analytics/pm-plugins/commands';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import { setHeadingWithAnalytics } from '../../../../plugins/block-type/commands';

describe('History Analytics Plugin: commands', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.Mock;
  let editorView: EditorView;
  let sel: number;

  const undo = () => commands.undo(editorView.state, editorView.dispatch);

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    ({ editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    }));
    createAnalyticsEvent.mockClear();
  });

  describe('undo', () => {
    it('does nothing when no events to undo', () => {
      undo();
      expect(createAnalyticsEvent).not.toHaveBeenCalled();
    });

    describe('standard event to undo', () => {
      it('adds undo analytics if analytics found in event', () => {
        setHeadingWithAnalytics(1, INPUT_METHOD.TOOLBAR)(
          editorView.state,
          editorView.dispatch,
        );
        undo();
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'undid',
          actionSubject: 'text',
          actionSubjectId: 'formatted',
          attributes: {
            inputMethod: 'toolbar',
            actionSubjectId: 'heading',
            newHeadingLevel: 1,
            previousHeadingLevel: 0,
          },
          eventType: 'track',
        });
      });

      it('does nothing if analytics not found in event', () => {
        insertText(editorView, 'a', sel);
        undo();
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });

    describe('autoformatting event to undo', () => {
      it('adds undo analytics if analytics found in any events', () => {
        insertText(editorView, '# ', sel);
        undo();
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'undid',
          actionSubject: 'text',
          actionSubjectId: 'formatted',
          attributes: {
            inputMethod: 'autoformatting',
            actionSubjectId: 'heading',
            newHeadingLevel: 1,
          },
          eventType: 'track',
        });
      });

      it('does nothing if analytics not found in any events', () => {
        // without enabling lists this won't do anything
        insertText(editorView, '* ', sel);
        undo();
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });
  });
});
