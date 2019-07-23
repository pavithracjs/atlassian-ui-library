import {
  createEditorFactory,
  doc,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import * as commands from '../../../../plugins/history-analytics/pm-plugins/commands';
import {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION_SUBJECT,
  withAnalytics,
} from '../../../../plugins/analytics';
import {
  setHeadingWithAnalytics,
  setHeading,
} from '../../../../plugins/block-type/commands';

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

    describe("events that undo doesn't make sense for", () => {
      it('does not fire undo event for "invoked" events', () => {
        withAnalytics({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD,
          actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
          attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
          eventType: EVENT_TYPE.UI,
        })(setHeading(1))(editorView.state, editorView.dispatch);
        createAnalyticsEvent.mockClear();
        undo();
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });

      it('does not fire undo event for "opened" events', () => {
        withAnalytics({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
          attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
          eventType: EVENT_TYPE.UI,
        })(setHeading(1))(editorView.state, editorView.dispatch);
        createAnalyticsEvent.mockClear();
        undo();
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });
  });
});
