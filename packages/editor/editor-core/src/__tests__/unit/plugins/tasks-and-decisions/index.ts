import {
  doc,
  createEditorFactory,
  p,
  sendKeyToPm,
  insertText,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';
import { uuid } from '@atlaskit/adf-schema';
import { EditorView } from 'prosemirror-view';
import {
  TaskDecisionPluginState,
  stateKey as taskDecisionPluginKey,
} from '../../../../plugins/tasks-and-decisions/pm-plugins/main';
import { setTextSelection } from 'prosemirror-utils';

describe('tasks and decisions', () => {
  const createEditor = createEditorFactory<TaskDecisionPluginState>();

  const scenarios = [
    {
      name: 'action',
      menuItem: 'task',
      list: taskList,
      item: taskItem,
      highlightsWhenActive: false,
    },
    {
      name: 'decision',
      menuItem: 'decision',
      list: decisionList,
      item: decisionItem,
      highlightsWhenActive: false,
    },
  ];

  let createAnalyticsEvent: CreateUIAnalyticsEventSignature;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    return createEditor({
      doc,
      editorProps: { allowAnalyticsGASV3: true, allowTasksAndDecisions: true },
      createAnalyticsEvent,
      pluginKey: taskDecisionPluginKey,
    });
  };

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  scenarios.forEach(scenario => {
    describe(`scenarios for ${scenario.name}`, () => {
      describe('quick insert', () => {
        let editorView: EditorView;
        let sel: number;

        beforeEach(() => {
          ({ editorView, sel } = editor(doc(p('{<>}'))));
          insertText(editorView, `/${scenario.menuItem}`, sel);
          sendKeyToPm(editorView, 'Enter');
        });

        it('should insert item', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(
              scenario.list({ localId: 'local-uuid' })(
                scenario.item({ localId: 'local-uuid' })(),
              ),
            ),
          );
        });

        it('should fire v3 analytics event when item inserted', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: scenario.name,
            attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
            eventType: 'track',
          });
        });
      });

      describe('highlight when active', () => {
        it('Ensure correct highlight in plugin state', () => {
          const { editorView, refs, pluginState } = editor(
            doc(
              scenario.list({ localId: 'l1' })(
                scenario.item({ localId: 'i1' })('1{<>}'),
                scenario.item({ localId: 'i2' })('2{item2}'),
              ),
            ),
          );
          if (scenario.highlightsWhenActive) {
            // 'highlighted' item is first item
            expect(pluginState.highlightTaskDecisionItem).toBeDefined;
            expect(
              pluginState.highlightTaskDecisionItem!.attrs.localId,
            ).toEqual('i1');
          } else {
            // not highlighted via pluginState.highlightTaskDecisionItem
            expect(pluginState.highlightTaskDecisionItem).toBeUndefined;
          }

          const { tr } = editorView.state;
          editorView.dispatch(setTextSelection(refs.item2)(tr));

          const afterPluginState = taskDecisionPluginKey.getState(
            editorView.state,
          );
          if (scenario.highlightsWhenActive) {
            // 'highlighted' item is now second item
            expect(afterPluginState.highlightTaskDecisionItem).toBeDefined;
            expect(
              afterPluginState.highlightTaskDecisionItem!.attrs.localId,
            ).toEqual('i2');
          } else {
            // not highlighted via pluginState.highlightTaskDecisionItem
            expect(pluginState.highlightTaskDecisionItem).toBeUndefined;
          }
        });
      });
    });
  });
});
