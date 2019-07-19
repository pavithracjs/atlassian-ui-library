import {
  createEditorFactory,
  doc,
  p,
  sendKeyToPm,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { setHeadingWithAnalytics } from '../../../../../plugins/block-type/commands';
import {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION_SUBJECT,
  withAnalytics,
} from '../../../../../plugins/analytics';
import { createTable } from '../../../../../plugins/table/commands';

describe('History Analytics Plugin', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.Mock;
  let editorView: EditorView;
  let sel: number;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    ({ editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
        allowRule: true,
      },
      createAnalyticsEvent,
    }));
  });

  it('fires undo analytics event when undo action', () => {
    setHeadingWithAnalytics(1, INPUT_METHOD.TOOLBAR)(
      editorView.state,
      editorView.dispatch,
    );
    sendKeyToPm(editorView, 'Mod-z');

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'undid',
      actionSubject: 'text',
      actionSubjectId: 'formatted',
      attributes: {
        actionSubjectId: 'heading',
        inputMethod: 'toolbar',
        previousHeadingLevel: 0,
        newHeadingLevel: 1,
      },
      eventType: 'track',
    });
  });

  it('fires each undo analytics event when undo multiple actions', () => {
    setHeadingWithAnalytics(1, INPUT_METHOD.TOOLBAR)(
      editorView.state,
      editorView.dispatch,
    );
    insertText(editorView, 'My Page Title');
    withAnalytics({
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.TABLE,
      attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
      eventType: EVENT_TYPE.TRACK,
    })(createTable)(editorView.state, editorView.dispatch);

    createAnalyticsEvent.mockClear();
    Array(3)
      .fill(null)
      .forEach(() => sendKeyToPm(editorView, 'Mod-z'));

    expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'undid',
      actionSubject: 'document',
      actionSubjectId: 'inserted',
      attributes: {
        actionSubjectId: 'table',
        inputMethod: 'toolbar',
      },
      eventType: 'track',
    });

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'undid',
      actionSubject: 'text',
      actionSubjectId: 'formatted',
      attributes: {
        actionSubjectId: 'heading',
        inputMethod: 'toolbar',
        previousHeadingLevel: 0,
        newHeadingLevel: 1,
      },
      eventType: 'track',
    });
  });

  it('fires undo analytics event when undo auto-formatting', () => {
    insertText(editorView, '---', sel);
    sendKeyToPm(editorView, 'Mod-z');
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'undid',
      actionSubject: 'document',
      actionSubjectId: 'inserted',
      attributes: {
        actionSubjectId: 'divider',
        inputMethod: 'autoformatting',
      },
      eventType: 'track',
    });
  });
});
