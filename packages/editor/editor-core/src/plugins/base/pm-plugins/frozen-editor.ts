import { Plugin } from 'prosemirror-state';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  DispatchAnalyticsEvent,
} from '../../analytics';
import { EditorView } from 'prosemirror-view';

const FREEZE_CHECK_TIME = 600;
const TIMER_INTERVAL = 100;

const runFreezeCheck = (cb: (num: number) => void) => {
  let prevTime = performance.now();
  return setInterval(() => {
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
      },
      eventType: EVENT_TYPE.OPERATIONAL,
    });
  });

export default (dispatchAnalyticsEvent: DispatchAnalyticsEvent) =>
  new Plugin({
    view(view) {
      let freezeTimer = freezeCheckTimer(dispatchAnalyticsEvent, view);
      document.addEventListener(
        'visibilitychange',
        () => {
          if (document.visibilityState == 'hidden') {
            clearInterval(freezeTimer);
          } else {
            freezeTimer = freezeCheckTimer(dispatchAnalyticsEvent, view);
          }
        },
        false,
      );
      return {};
    },
  });
