import rafSchedule from 'raf-schd';
import {
  DispatchAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  PLATFORMS,
  MODE,
} from '../../analytics';

const scrollToAnchorLink = rafSchedule(
  (anchorName: string, dispatchAnalyticsEvent?: DispatchAnalyticsEvent) => {
    const anchorElement = document.getElementById(anchorName);

    if (anchorElement) {
      anchorElement.scrollIntoView();

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANCHOR_LINK,
          attributes: { platform: PLATFORMS.WEB, mode: MODE.EDITOR },
          eventType: EVENT_TYPE.UI,
        });
      }
    }
  },
);

export default scrollToAnchorLink;
