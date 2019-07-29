import { Plugin } from 'prosemirror-state';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  DispatchAnalyticsEvent,
} from '../../analytics';
import { EditorView } from 'prosemirror-view';
import { getNodesCount } from '../../../utils/document';

const FREEZE_CHECK_TIME = 800;
const TIMER_INTERVAL = 100;

const runFreezeCheck = (cb: (num: number) => void) => {
  let prevTime = performance.now();
  return window.setInterval(() => {
    const timeDiff = performance.now() - prevTime;
    const timerRunTime = timeDiff - TIMER_INTERVAL;
    if (timerRunTime > FREEZE_CHECK_TIME) {
      cb(Math.round(timerRunTime));
    }
    prevTime = performance.now();
  }, TIMER_INTERVAL);
};

const freezeCheckTimer = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  view: EditorView,
) =>
  runFreezeCheck((time: number) => {
    const { state } = view;
    dispatchAnalyticsEvent({
      action: ACTION.BROWSER_FREEZE,
      actionSubject: ACTION_SUBJECT.EDITOR,
      attributes: {
        freezeTime: time,
        nodeSize: state.doc.nodeSize,
        nodes: getNodesCount(state.doc),
      },
      eventType: EVENT_TYPE.OPERATIONAL,
    });
  });

export default (dispatchAnalyticsEvent: DispatchAnalyticsEvent) =>
  new Plugin({
    view(view) {
      let freezeTimer: number | undefined = freezeCheckTimer(
        dispatchAnalyticsEvent,
        view,
      );
      const onVisibilityChange = (
        dispatchAnalyticsEvent: DispatchAnalyticsEvent,
        view: EditorView,
      ) => {
        if (document.visibilityState == 'hidden') {
          window.clearInterval(freezeTimer);
          freezeTimer = undefined;
        } else {
          freezeTimer = freezeCheckTimer(dispatchAnalyticsEvent, view);
        }
      };

      const handleVisibilityChange = onVisibilityChange.bind(
        null,
        dispatchAnalyticsEvent,
        view,
      );
      document.addEventListener(
        'visibilitychange',
        handleVisibilityChange,
        false,
      );
      return {
        destroy: () => {
          window.clearInterval(freezeTimer);
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
          );
        },
      };
    },
  });
