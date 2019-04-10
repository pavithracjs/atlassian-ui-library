import { EditorState } from 'prosemirror-state';
import { EmojiProvider } from '@atlaskit/emoji';
import {
  createEditorFactory,
  doc,
  p,
  insertText,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { analyticsService, AnalyticsHandler } from '../../../../../analytics';
import { emojiPlugin } from '../../../../../plugins';
import { selectCurrentItem } from '../../../../../plugins/type-ahead/commands/select-item';
import { TypeAheadItem } from '../../../../../plugins/type-ahead/types';

describe('EmojiTypeAhead', () => {
  const emojiProvider = Promise.resolve({} as EmojiProvider);

  describe('Analytics', () => {
    const createEditor = createEditorFactory();
    const editor = (
      trackEvent: any,
      customGetItems?: any,
      mockSelectItem?: any,
      dispatchAnalyticsEvent?: any,
    ) =>
      createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          emojiProvider: customGetItems ? undefined : emojiProvider,
          analyticsHandler: trackEvent,
          allowAnalyticsGASV3: true,
        },
        createAnalyticsEvent: dispatchAnalyticsEvent,
        editorPlugins: [
          {
            ...emojiPlugin,
            pluginsOptions: {
              typeAhead: {
                ...emojiPlugin.pluginsOptions!.typeAhead,
                getItems:
                  customGetItems ||
                  emojiPlugin.pluginsOptions!.typeAhead!.getItems,
                selectItem: mockSelectItem
                  ? (
                      state: EditorState,
                      item: TypeAheadItem,
                      _insert: any,
                      meta: any,
                    ) => {
                      return emojiPlugin.pluginsOptions!.typeAhead!.selectItem(
                        state,
                        item,
                        () => state.tr,
                        meta,
                      );
                    }
                  : emojiPlugin.pluginsOptions!.typeAhead!.selectItem,
              },
            },
          },
        ],
      });

    let trackEvent: jest.SpyInstance<AnalyticsHandler>;
    let dispatchAnalyticsSpy: jest.Mock;

    beforeEach(() => {
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');
      dispatchAnalyticsSpy = jest.fn(() => ({ fire: () => {} }));
    });

    afterEach(() => {
      trackEvent.mockRestore();
    });

    it('should fire analytics when type ahead is opened', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he`, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.open',
        {},
      );
    });

    it('should fire analytics when type ahead is closed', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he`, sel);
      sendKeyToPm(editorView, 'Escape');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.close',
        {},
      );
    });

    it('should fire analytics after space is typed', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he `, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.space',
        {},
      );
    });

    // TODO:
    it.skip('should fire analytics in handleSelectPrevious', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he `, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.keyup',
        {},
      );
    });

    // TODO:
    it.skip('should fire analytics in handleSelectNext', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he `, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.keydown',
        {},
      );
    });

    it('should fire analytics when enter is pressed', async () => {
      const { editorView, sel } = editor(
        trackEvent,
        () => [
          {
            title: 'foo',
            emoji: {
              id: 'emojiId',
              type: 'emojiType',
            },
          },
        ],
        true,
      );

      insertText(editorView, `:foo`, sel);
      sendKeyToPm(editorView, 'Enter');

      expect(trackEvent).toHaveBeenCalled();

      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.select',
        expect.objectContaining({
          mode: 'enter',
          emojiId: 'emojiId',
          type: 'emojiType',
          queryLength: 3,
        }),
      );
    });

    it('should fire analytics when selected from typeahead', () => {
      const { editorView, sel } = editor(
        trackEvent,
        () => [
          {
            title: 'foo',
            emoji: {
              id: 'emojiId',
              type: 'emojiType',
            },
          },
        ],
        true,
        dispatchAnalyticsSpy,
      );

      insertText(editorView, `:foo`, sel);
      selectCurrentItem('selected')(editorView.state, editorView.dispatch);

      expect(trackEvent).toHaveBeenNthCalledWith(
        4,
        'atlassian.fabric.emoji.typeahead.select',
        expect.objectContaining({
          mode: 'selected',
          emojiId: 'emojiId',
          type: 'emojiType',
          queryLength: 3,
        }),
      );

      expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'emoji',
        attributes: { inputMethod: 'typeAhead' },
        eventType: 'track',
      });
    });
  });
});
