import { Transaction, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  createEditorFactory,
  doc,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';
import * as utils from '../../../../plugins/history-analytics/pm-plugins/utils';
import {
  HistoryAnalyticsPluginState,
  historyAnalyticsPluginKey,
} from '../../../../plugins/history-analytics/pm-plugins/main';
import {
  INPUT_METHOD,
  analyticsPluginKey,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  addAnalytics,
  AnalyticsEventPayload,
} from '../../../../plugins/analytics';
import { Mapping, StepMap, ReplaceStep } from 'prosemirror-transform';
import {
  DEPTH_OVERFLOW,
  PmHistoryItem,
  PmHistoryBranch,
} from '../../../../plugins/history-analytics/pm-plugins/prosemirror-history-types';
import { Slice } from 'prosemirror-model';

const insertDividerAnalytics: AnalyticsEventPayload = {
  action: ACTION.INSERTED,
  actionSubject: ACTION_SUBJECT.DOCUMENT,
  actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
  attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
  eventType: EVENT_TYPE.TRACK,
};
const formatHeadingAnalytics: AnalyticsEventPayload = {
  action: ACTION.FORMATTED,
  actionSubject: ACTION_SUBJECT.TEXT,
  actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
  attributes: { inputMethod: INPUT_METHOD.FORMATTING, newHeadingLevel: 1 },
  eventType: EVENT_TYPE.TRACK,
};

describe('History Analytics Plugin: utils', () => {
  const createEditor = createEditorFactory();
  const createTransaction = (
    mapRanges: [number, number, number] = [1, 0, 1],
  ) => {
    const tr = new Transaction(editorView.state as any);
    tr.mapping = new Mapping([new StepMap(mapRanges)]);
    tr.steps = [
      new ReplaceStep(mapRanges[0], mapRanges[0] + mapRanges[2], Slice.empty),
    ];
    tr.docs = [editorView.state.doc];
    return tr;
  };
  const createPmHistoryItem = (
    mapRanges: [number, number, number] = [1, 0, 1],
  ): PmHistoryItem => ({
    map: new StepMap(mapRanges),
    step: new ReplaceStep(
      mapRanges[0],
      mapRanges[0] + mapRanges[2],
      Slice.empty,
    ),
    selection: new TextSelection(
      editorView.state.doc.resolve(mapRanges[0]),
    ).getBookmark(),
  });
  const createPmHistoryBranch = (
    opts: { items?: PmHistoryItem[]; eventCount?: number } = {},
  ): PmHistoryBranch => {
    const { items, eventCount } = opts;
    return {
      eventCount: eventCount !== undefined ? eventCount : 0,
      items: {
        values: items || [],
        length: items ? items.length : 0,
        forEach: () => {},
      },
    };
  };

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

  describe('pushTransactionsToHistory', () => {
    const pushTransactionsToHistory = (
      transactions: Transaction[],
      opts?: { done?: Transaction[]; undone?: Transaction[] },
    ) => {
      let originalPluginState: HistoryAnalyticsPluginState;
      if (opts) {
        const { done, undone } = opts;
        originalPluginState = {
          done: done || [],
          undone: undone || [],
        };
      } else {
        originalPluginState = historyAnalyticsPluginKey.getState(
          editorView.state,
        );
      }

      const pluginState = utils.pushTransactionsToHistory(
        transactions,
        originalPluginState,
        editorView.state,
      );
      return { pluginState, originalPluginState };
    };

    describe('no transactions passed', () => {
      it('returns original plugin state', () => {
        const { pluginState, originalPluginState } = pushTransactionsToHistory(
          [],
        );
        expect(pluginState).toBe(originalPluginState);
      });

      it('does not reset undone stack', () => {
        const undone = [createTransaction()];
        const { pluginState } = pushTransactionsToHistory([], {
          undone,
        });
        expect(pluginState.undone).toBe(undone);
      });
    });

    describe('one transaction passed', () => {
      let tr: Transaction;

      describe('and addToHistory meta is set to false on tr', () => {
        beforeEach(() => {
          tr = createTransaction();
          tr.setMeta('addToHistory', false);
        });

        it('returns original plugin state', () => {
          const {
            pluginState,
            originalPluginState,
          } = pushTransactionsToHistory([tr]);
          expect(pluginState).toBe(originalPluginState);
        });

        it('does not reset undone stack', () => {
          const undone = [createTransaction()];
          const { pluginState } = pushTransactionsToHistory([tr], {
            undone,
          });
          expect(pluginState.undone).toBe(undone);
        });
      });

      describe('and tr can be merged with previous transaction', () => {
        beforeEach(() => {
          // Dispatch a real transaction so we get some real plugin state
          // We need a previous map to check against in prosemirror-history
          insertText(editorView, 'a');
          tr = createTransaction([1, 2, 0]);
        });

        it("extracts tr's analytics and applies to last saved tr", () => {
          addAnalytics(tr, insertDividerAnalytics);
          const { pluginState } = pushTransactionsToHistory([tr]);
          expect(
            pluginState.done[pluginState.done.length - 1].getMeta(
              analyticsPluginKey,
            ),
          ).toContainEqual({ payload: insertDividerAnalytics });
        });

        it('does not add tr to done stack', () => {
          const {
            pluginState,
            originalPluginState,
          } = pushTransactionsToHistory([tr]);
          expect(pluginState.done.length).toBe(originalPluginState.done.length);
        });

        it('resets undone stack', () => {
          const { pluginState } = pushTransactionsToHistory([tr], {
            undone: [createTransaction()],
          });
          expect(pluginState.undone).toHaveLength(0);
        });
      });

      describe('and tr cannot be merged with previous transaction', () => {
        beforeEach(() => {
          // Dispatch a real transaction so we get some real plugin state
          insertText(editorView, 'a');
          tr = createTransaction();
        });

        it('adds tr to done stack', () => {
          const {
            pluginState,
            originalPluginState,
          } = pushTransactionsToHistory([tr]);
          expect(pluginState.done).toHaveLength(
            originalPluginState.done.length + 1,
          );
        });

        it('resets undone stack', () => {
          const { pluginState } = pushTransactionsToHistory([tr], {
            undone: [createTransaction()],
          });
          expect(pluginState.undone).toHaveLength(0);
        });
      });
    });

    describe('multiple transactions passed', () => {
      let trs: Transaction[];

      describe('and both have addToHistory meta set to false', () => {
        beforeEach(() => {
          insertText(editorView, 'a');
          trs = [
            createTransaction().setMeta('addToHistory', false),
            createTransaction().setMeta('addToHistory', false),
          ];
        });

        it('returns original plugin state', () => {
          const {
            pluginState,
            originalPluginState,
          } = pushTransactionsToHistory(trs);
          expect(pluginState).toBe(originalPluginState);
        });

        it('does not reset undone stack', () => {
          const undone = [createTransaction()];
          const { pluginState } = pushTransactionsToHistory(trs, {
            undone,
          });
          expect(pluginState.undone).toBe(undone);
        });
      });

      describe('and both can be merged with previous transaction', () => {
        beforeEach(() => {
          // Dispatch a real transaction so we get some real plugin state
          // We need a previous map to check against in prosemirror-history
          insertText(editorView, 'a');
          trs = [createTransaction([1, 2, 0]), createTransaction([1, 2, 0])];
        });

        it("extracts skipped trs' analytics and applies to last saved tr", () => {
          addAnalytics(trs[0], insertDividerAnalytics);
          addAnalytics(trs[1], formatHeadingAnalytics);
          const { pluginState } = pushTransactionsToHistory(trs);

          const lastTrAnalytics = pluginState.done[
            pluginState.done.length - 1
          ].getMeta(analyticsPluginKey);
          expect(lastTrAnalytics).toContainEqual({
            payload: insertDividerAnalytics,
          });
          expect(lastTrAnalytics).toContainEqual({
            payload: formatHeadingAnalytics,
          });
        });

        it('resets undone stack', () => {
          const undone = [createTransaction()];
          const { pluginState } = pushTransactionsToHistory(trs, {
            undone,
          });
          expect(pluginState.undone).toHaveLength(0);
        });
      });

      describe('and only one can be merged with previous transaction', () => {
        beforeEach(() => {
          insertText(editorView, 'abc');
          trs = [createTransaction([2, 0, 1]), createTransaction([1, 2, 0])];
        });

        it("extracts skipped tr's analytics and applies to first tr", () => {
          addAnalytics(trs[1], formatHeadingAnalytics);
          const { pluginState } = pushTransactionsToHistory(trs);
          expect(
            pluginState.done[pluginState.done.length - 1].getMeta(
              analyticsPluginKey,
            ),
          ).toContainEqual({ payload: formatHeadingAnalytics });
        });

        it('adds "new" tr to done stack', () => {
          const { pluginState } = pushTransactionsToHistory(trs);
          const lastTrMap =
            pluginState.done[pluginState.done.length - 1].mapping.maps[0];

          expect(lastTrMap).toMatchObject({ ranges: [1, 2, 0] });
        });

        it('resets undone stack', () => {
          const undone = [createTransaction()];
          const { pluginState } = pushTransactionsToHistory(trs, {
            undone,
          });
          expect(pluginState.undone).toHaveLength(0);
        });
      });

      describe('and neither can be merged with previous transaction', () => {
        beforeEach(() => {
          insertText(editorView, 'abcd');
          trs = [createTransaction([2, 0, 1]), createTransaction([2, 0, 1])];
        });

        it('adds both trs to done stack', () => {
          const { pluginState } = pushTransactionsToHistory(trs);
          const trMaps = pluginState.done
            .slice(-2)
            .map(tr => tr.mapping.maps[0]);
          expect(trMaps).toEqual([
            expect.objectContaining({ ranges: [2, 0, 1] }),
            expect.objectContaining({ ranges: [2, 0, 1] }),
          ]);
        });

        it('resets undone stack', () => {
          const undone = [createTransaction()];
          const { pluginState } = pushTransactionsToHistory(trs, {
            undone,
          });
          expect(pluginState.undone).toHaveLength(0);
        });
      });
    });

    describe('and done stack has exceeded max depth + overflow', () => {
      let depth: number;
      let originalPluginState: HistoryAnalyticsPluginState;

      beforeEach(() => {
        depth = utils.getPmHistoryPluginConfig(editorView.state).depth;
        const trs = Array(depth + DEPTH_OVERFLOW)
          .fill(null)
          .map(() => createTransaction());
        ({ pluginState: originalPluginState } = pushTransactionsToHistory(trs));
      });

      it('resets stack to max depth when 1 transaction over', () => {
        const tr = createTransaction([1, 2, 0]);
        const { pluginState } = pushTransactionsToHistory(
          [tr],
          originalPluginState,
        );
        const lastTrMap =
          pluginState.done[pluginState.done.length - 1].mapping.maps[0];

        expect(pluginState.done).toHaveLength(depth);
        expect(lastTrMap).toMatchObject({ ranges: [1, 2, 0] });
      });

      it('resets stack to max depth when multiple transactions over', () => {
        const trs = [
          createTransaction([1, 2, 0]),
          createTransaction([1, 3, 0]),
          createTransaction([1, 4, 0]),
        ];
        const { pluginState } = pushTransactionsToHistory(
          trs,
          originalPluginState,
        );
        const lastTrsMaps = pluginState.done
          .slice(-3)
          .map(tr => tr.mapping.maps[0]);

        expect(pluginState.done).toHaveLength(depth);
        expect(lastTrsMaps).toEqual([
          expect.objectContaining({ ranges: [1, 2, 0] }),
          expect.objectContaining({ ranges: [1, 3, 0] }),
          expect.objectContaining({ ranges: [1, 4, 0] }),
        ]);
      });

      it('does not reset undone stack', () => {
        const { pluginState } = pushTransactionsToHistory(
          [createTransaction()],
          { ...originalPluginState, undone: [createTransaction()] },
        );
        expect(pluginState.undone).toHaveLength(0);
      });
    });
  });

  describe('syncWithPmHistory', () => {
    const syncWithPmHistory = (
      opts: {
        done?: Transaction[];
        undone?: Transaction[];
        pmHistoryDone?: { items: PmHistoryItem[]; eventCount: number };
        pmHistoryUndone?: { items: PmHistoryItem[]; eventCount: number };
      } = {},
    ) => {
      const { done, undone, pmHistoryDone, pmHistoryUndone } = opts;
      const originalPluginState: HistoryAnalyticsPluginState = {
        done: done || [],
        undone: undone || [],
      };
      const pmHistoryPluginState = {
        done: createPmHistoryBranch(pmHistoryDone),
        undone: createPmHistoryBranch(pmHistoryUndone),
        prevTime: 0,
      };

      const pluginState = utils.syncWithPmHistory(
        originalPluginState,
        pmHistoryPluginState,
        editorView.state,
      );
      return { pluginState, originalPluginState, pmHistoryPluginState };
    };

    describe('stacks are same size', () => {
      describe('and both are 0 in length', () => {
        it('returns original plugin state', () => {
          const { pluginState, originalPluginState } = syncWithPmHistory();
          expect(originalPluginState).toBe(pluginState);
        });
      });

      describe('and last items match', () => {
        it('returns original plugin state', () => {
          const item = createPmHistoryItem();
          const { pluginState, originalPluginState } = syncWithPmHistory({
            done: [utils.generateTrFromItem(item, editorView.state)],
            pmHistoryDone: { items: [item], eventCount: 1 },
          });
          expect(originalPluginState).toBe(pluginState);
        });
      });

      describe('and last items are inverse', () => {
        it("updates our last item's map", () => {
          const item = createPmHistoryItem();
          const tr = utils.generateTrFromItem(item, editorView.state);
          item.map = item.map.invert();
          item.step = item.step.invert(createTransaction().doc);
          const { pluginState } = syncWithPmHistory({
            done: [tr],
            pmHistoryDone: { items: [item], eventCount: 1 },
          });
          const { done } = pluginState;

          expect(done).toHaveLength(1);
          expect(done[0].mapping.maps[0]).toBe(item.map);
        });
      });

      describe('and last items are different', () => {
        it("rebuilds stack from prosemirror-history's", () => {
          const item = createPmHistoryItem();
          const { pluginState } = syncWithPmHistory({
            done: [createTransaction()],
            pmHistoryDone: { items: [item], eventCount: 1 },
          });
          const { done } = pluginState;

          expect(done).toHaveLength(1);
          expect(done[0].mapping.maps[0]).toBe(item.map);
        });
      });
    });

    describe("prosemirror-history's stack is bigger", () => {
      describe('and last items are different', () => {
        it('fills in the difference with generated transactions', () => {
          const items: PmHistoryItem[] = [
            createPmHistoryItem(),
            createPmHistoryItem([2, 0, 1]),
          ];
          const tr = utils.generateTrFromItem(items[0], editorView.state);
          const { pluginState, originalPluginState } = syncWithPmHistory({
            done: [tr],
            pmHistoryDone: { items, eventCount: 2 },
          });
          const { done } = pluginState;

          expect(done).toHaveLength(2);
          expect(done[0]).toBe(originalPluginState.done[0]);
          expect(done[1].mapping.maps[0]).toBe(items[1].map);
        });
      });

      describe('and last items are the same', () => {
        it("rebuilds stack from prosemirror-history's", () => {
          const items: PmHistoryItem[] = [
            createPmHistoryItem(),
            createPmHistoryItem([2, 0, 1]),
          ];
          const tr = utils.generateTrFromItem(items[1], editorView.state);
          const { pluginState } = syncWithPmHistory({
            done: [tr],
            pmHistoryDone: { items, eventCount: 2 },
          });
          const { done } = pluginState;

          expect(done).toHaveLength(2);
          expect(done[0].mapping.maps[0]).toBe(items[0].map);
          expect(done[1].mapping.maps[0]).toBe(items[1].map);
        });
      });
    });

    describe("prosemirror-history's stack is smaller", () => {
      describe('and last items are different', () => {
        it('drops transactions until last items match', () => {
          const item = createPmHistoryItem();
          const trs = [
            utils.generateTrFromItem(item, editorView.state),
            createTransaction(),
          ];
          const { pluginState } = syncWithPmHistory({
            done: trs,
            pmHistoryDone: { items: [item], eventCount: 1 },
          });
          const { done } = pluginState;

          expect(done).toEqual([trs[0]]);
        });

        describe('and stacks are a different length after dropping transactions', () => {
          it("rebuilds stack from prosemirror-history's", () => {
            const item = createPmHistoryItem();
            const trs = [
              createTransaction(),
              utils.generateTrFromItem(item, editorView.state),
              createTransaction(),
            ];
            const { pluginState } = syncWithPmHistory({
              done: trs,
              pmHistoryDone: { items: [item], eventCount: 1 },
            });
            const { done } = pluginState;

            expect(done).toHaveLength(1);
            expect(done[0].mapping.maps[0]).toBe(item.map);
          });
        });
      });

      describe('and last items are the same', () => {
        it("rebuilds stack from prosemirror-history's", () => {
          const item = createPmHistoryItem();
          const trs = [
            createTransaction(),
            utils.generateTrFromItem(item, editorView.state),
          ];
          const { pluginState } = syncWithPmHistory({
            done: trs,
            pmHistoryDone: { items: [item], eventCount: 1 },
          });
          const { done } = pluginState;

          expect(done).toHaveLength(1);
          expect(done[0].mapping.maps[0]).toBe(item.map);
        });
      });
    });
  });
});
