import scrollToAnchorLink from '../../../../../plugins/heading/pm-plugins/scroll-to-anchor';
import { DispatchAnalyticsEvent } from '../../../../../plugins/analytics';
jest.mock('raf-schd', () => (fn: Function) => fn);

describe('scrollToAnchorLink', () => {
  const dispatchAnalyticsEvent: DispatchAnalyticsEvent = jest.fn();

  afterEach(() => {
    (dispatchAnalyticsEvent as jest.Mock).mockClear();
  });

  it('calls dispatchAnalyticsEvent with correct event when target anchor element is exist', () => {
    jest.spyOn(document, 'getElementById').mockImplementation(() => ({
      scrollIntoView: jest.fn(),
    }));
    scrollToAnchorLink('test', dispatchAnalyticsEvent);
    expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
      action: 'viewed',
      actionSubject: 'anchorLink',
      attributes: {
        mode: 'editor',
        platform: 'web',
      },
      eventType: 'ui',
    });
    (document.getElementById as jest.Mock).mockRestore();
  });

  it('dose not call dispatchAnalyticsEvent when target anchor element is not exist', () => {
    jest.spyOn(document, 'getElementById').mockImplementation(() => null);
    scrollToAnchorLink('test', dispatchAnalyticsEvent);
    expect(dispatchAnalyticsEvent).not.toHaveBeenCalled();
    (document.getElementById as jest.Mock).mockRestore();
  });
});
