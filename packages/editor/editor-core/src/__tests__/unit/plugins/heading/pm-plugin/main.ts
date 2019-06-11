import { createPlugin } from '../../../../../plugins/heading/pm-plugins/main';

jest.mock('../../../../../plugins/heading/pm-plugins/scroll-to-anchor');
import scrollToAnchorLink from '../../../../../plugins/heading/pm-plugins/scroll-to-anchor';
import { PortalProviderAPI } from '../../../../..';
import { DispatchAnalyticsEvent } from '../../../../../plugins/analytics';

describe('heading plugin', () => {
  const oldHash = location.hash;
  const portalProviderAPI: PortalProviderAPI = {
    render(component: () => React.ReactChild | null) {
      component();
    },
    remove() {},
  } as any;
  const dispatchAnalyticsEvent: DispatchAnalyticsEvent = jest.fn();
  const plugin = createPlugin(portalProviderAPI, dispatchAnalyticsEvent);

  beforeAll(() => {
    jest.spyOn(window, 'setTimeout').mockImplementation(fn => fn());
  });

  afterEach(() => {
    (scrollToAnchorLink as jest.Mock).mockClear();
  });

  afterAll(() => {
    location.hash = oldHash;
    (window.setTimeout as jest.Mock).mockRestore();
  });

  it('calls scrollToAnchorLink with correct params when location hash exists', () => {
    location.hash = 'heading1';

    plugin.spec.view();
    expect(scrollToAnchorLink).toHaveBeenCalledWith(
      'heading1',
      dispatchAnalyticsEvent,
    );
  });

  it('does not call scrollToAnchorLink when location hash does not exist', () => {
    location.hash = '';
    plugin.spec.view();
    expect(scrollToAnchorLink).not.toHaveBeenCalled();
  });
});
