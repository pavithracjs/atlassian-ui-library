import {
  createEditorFactory,
  doc,
  p,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import * as commands from '../../../../../plugins/history-analytics/pm-plugins/commands';

describe('History Analytics Plugin: keymap', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.Mock;
  let editorView: EditorView;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    ({ editorView } = createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    }));
  });

  it('calls undo when Mod-z is hit', () => {
    jest.spyOn(commands, 'undo');
    sendKeyToPm(editorView, 'Mod-z');
    expect(commands.undo).toHaveBeenCalled();
  });
});
