import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import {
  QuickSearchContainer,
  SearchResultProps,
  Props,
} from '../../../components/common/QuickSearchContainer';
import { GlobalQuickSearch } from '../../../components/GlobalQuickSearch';
import { delay } from '../_test-util';
import * as AnalyticsHelper from '../../../util/analytics-event-helper';
import { DEVELOPMENT_LOGGER } from '../../../../example-helpers/logger';
import { ResultsWithTiming } from '../../../model/Result';
import { ABTest } from '../../../api/CrossProductSearchClient';
import {
  ShownAnalyticsAttributes,
  PerformanceTiming,
} from '../../../util/analytics-util';
import { CreateAnalyticsEventFn } from '../../../components/analytics/types';
import { ReferralContextIdentifiers } from '../../../components/GlobalQuickSearchWrapper';

const defaultABTestData = {
  experimentId: 'test-experiement-id',
  abTestId: 'test-abtest-id',
  controlId: 'test-control-id',
};

const defaultReferralContext = {
  searchReferrerId: 'referrerId',
  currentContentId: 'currentContentId',
  currentContainerId: 'currentContainerId',
};

const defaultProps = {
  logger: DEVELOPMENT_LOGGER,
  getSearchResultsComponent: jest.fn((props: SearchResultProps) => null),
  getRecentItems: jest.fn((sessionId: string) =>
    Promise.resolve({ results: {} }),
  ),
  getSearchResults: jest.fn(
    (query: string, sessionId: string, startTime: number) =>
      Promise.resolve({ results: {} }),
  ),
  getAbTestData: jest.fn((sesionId: string) =>
    Promise.resolve(defaultABTestData),
  ),
  createAnalyticsEvent: jest.fn(),
  handleSearchSubmit: jest.fn(),
  referralContextIdentifiers: defaultReferralContext,
};

const mountQuickSearchContainer = (partialProps?: Partial<Props>) => {
  const props = {
    ...defaultProps,
    ...partialProps,
  };
  return mount(<QuickSearchContainer {...props} />);
};

async function waitForRender(wrapper: ReactWrapper, millis?: number) {
  await delay(millis);
  wrapper.update();
}

const assertLastCall = (spy: jest.Mock<{}>, obj: {} | any[]) => {
  expect(spy).toHaveBeenCalled();
  const getSearchResultComponentLastCall =
    spy.mock.calls[spy.mock.calls.length - 1];
  expect(getSearchResultComponentLastCall[0]).toMatchObject(obj);
};

describe('QuickSearchContainer', () => {
  let firePreQueryShownEventSpy: jest.SpyInstance<
    (
      eventAttributes: ShownAnalyticsAttributes,
      elapsedMs: number,
      renderTimeMs: number,
      searchSessionId: string,
      createAnalyticsEvent: CreateAnalyticsEventFn,
      abTest: ABTest,
      referralContextIdentifiers?: ReferralContextIdentifiers,
      experimentRequestDurationMs?: number | undefined,
      retrievedFromAggregator?: boolean | undefined,
    ) => void
  >;
  let firePostQueryShownEventSpy: jest.SpyInstance<
    (
      resultsDetails: ShownAnalyticsAttributes,
      timings: PerformanceTiming,
      searchSessionId: string,
      query: string,
      createAnalyticsEvent: CreateAnalyticsEventFn,
      abTest: ABTest,
      referralContextIdentifiers?: ReferralContextIdentifiers,
    ) => void
  >;
  let fireExperimentExposureEventSpy: jest.SpyInstance<
    (
      abTest: ABTest,
      searchSessionId: string,
      createAnalyticsEvent: CreateAnalyticsEventFn,
    ) => void
  >;

  const assertPreQueryAnalytics = (
    recentItems: Record<any, any>,
    abTest: ABTest,
  ) => {
    expect(firePreQueryShownEventSpy).toBeCalled();
    const lastCall =
      firePreQueryShownEventSpy.mock.calls[
        firePreQueryShownEventSpy.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.objectContaining({
        resultCount: Object.keys(recentItems)
          .map(key => recentItems[key])
          .reduce((acc, arr) => acc + arr.length, 0),
        resultSectionCount: Object.keys(recentItems).length,
      }),
      expect.any(Number),
      expect.any(Number),
      expect.any(String),
      defaultProps.createAnalyticsEvent,
      abTest,
      defaultReferralContext,
      expect.any(Number),
      expect.any(Boolean),
    ]);
  };

  const assertPostQueryAnalytics = (
    query: string,
    searchResults: {
      [x: string]: any;
      spaces?: { key: string }[] | { key: string }[];
    },
  ) => {
    expect(firePostQueryShownEventSpy).toBeCalled();
    const lastCall =
      firePostQueryShownEventSpy.mock.calls[
        firePostQueryShownEventSpy.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.objectContaining({
        resultCount: Object.keys(searchResults)
          .map(key => searchResults[key])
          .reduce((acc, arr) => acc + arr.length, 0),
        resultSectionCount: Object.keys(searchResults).length,
      }),
      expect.objectContaining({
        startTime: expect.any(Number),
        elapsedMs: expect.any(Number),
      }),
      expect.any(String),
      query,
      defaultProps.createAnalyticsEvent,
      defaultABTestData,
      defaultReferralContext,
    ]);
  };

  const assertExposureEventAnalytics = (abTest: ABTest) => {
    expect(fireExperimentExposureEventSpy).toBeCalledWith(
      abTest,
      expect.any(String),
      defaultProps.createAnalyticsEvent,
    );
  };

  beforeEach(() => {
    firePreQueryShownEventSpy = jest.spyOn(
      AnalyticsHelper,
      'firePreQueryShownEvent',
    );
    firePostQueryShownEventSpy = jest.spyOn(
      AnalyticsHelper,
      'firePostQueryShownEvent',
    );
    fireExperimentExposureEventSpy = jest.spyOn(
      AnalyticsHelper,
      'fireExperimentExposureEvent',
    );
  });

  afterEach(() => {
    // reset mocks of default props
    defaultProps.getRecentItems.mockReset();
    defaultProps.getSearchResults.mockReset();
    defaultProps.getSearchResultsComponent.mockReset();
    defaultProps.handleSearchSubmit.mockReset();
    firePostQueryShownEventSpy.mockReset();
    firePreQueryShownEventSpy.mockReset();
  });

  it('should render GlobalQuickSearch', () => {
    const wrapper = mountQuickSearchContainer();
    const globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.length).toBe(1);
    expect(globalQuickSearch.props().isLoading).toBe(true);
  });

  it('should render recent items after mount', async () => {
    const recentItems = {
      recentPages: [
        {
          id: 'page-1',
        },
      ],
    };

    const abTest: ABTest = {
      abTestId: 'abTestId',
      experimentId: 'experimentId',
      controlId: 'controlId',
    };

    const getRecentItems = jest.fn<Promise<ResultsWithTiming>>(() =>
      Promise.resolve({ results: recentItems }),
    );
    const getAbTestData = jest.fn<Promise<ABTest>>(() =>
      Promise.resolve(abTest),
    );
    const wrapper = mountQuickSearchContainer({
      getRecentItems,
      getAbTestData,
    });

    let globalQuickSearch = wrapper.find(GlobalQuickSearch);
    await globalQuickSearch.props().onMount();
    await wrapper.update();

    // after update
    globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.props().isLoading).toBe(false);
    expect(getRecentItems).toHaveBeenCalled();
    assertLastCall(defaultProps.getSearchResultsComponent, {
      recentItems,
      isLoading: false,
      isError: false,
    });

    assertPreQueryAnalytics(recentItems, abTest);
    assertExposureEventAnalytics(abTest);
  });

  it('should add searchSessionId to handleSearchSubmit', () => {
    const wrapper = mountQuickSearchContainer();
    wrapper.find('input').simulate('keydown', { key: 'Enter' });
    wrapper.update();

    const { searchSessionId } = wrapper.find(QuickSearchContainer).state();
    expect(searchSessionId).not.toBeNull();

    expect(defaultProps.handleSearchSubmit).toHaveBeenCalledWith(
      expect.anything(),
      searchSessionId,
    );
  });

  it('should fall back to default ab test data if the experiment call fails', async () => {
    const recentItems = {
      recentPages: [
        {
          id: 'page-1',
        },
      ],
    };

    const defaultAbTest: ABTest = {
      abTestId: 'default',
      experimentId: 'default',
      controlId: 'default',
    };

    const getRecentItems = jest.fn<Promise<ResultsWithTiming>>(() =>
      Promise.resolve({ results: recentItems }),
    );
    const getAbTestData = jest.fn<Promise<ABTest>>(() =>
      Promise.reject(new Error('everything is broken')),
    );
    const wrapper = mountQuickSearchContainer({
      getRecentItems,
      getAbTestData,
    });

    let globalQuickSearch = wrapper.find(GlobalQuickSearch);
    await globalQuickSearch.props().onMount();
    await wrapper.update();

    assertPreQueryAnalytics(recentItems, defaultAbTest);
    assertExposureEventAnalytics(defaultAbTest);
  });

  describe('Search', () => {
    let getSearchResults: jest.Mock<{}>;

    const renderAndWait = async (getRecentItems?: undefined) => {
      const wrapper = mountQuickSearchContainer({
        getSearchResults,
        ...(getRecentItems ? { getRecentItems } : {}),
      });
      await waitForRender(wrapper, 10);
      return wrapper;
    };

    const search = async (
      wrapper:
        | ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
        | ReactWrapper<{}, {}, React.Component<{}, {}, any>>,
      query: string,
      resultPromise:
        | Promise<{ results: { spaces: { key: string }[] } }>
        | Promise<never>
        | Promise<{ results: { spaces: { key: string }[] } }>,
    ) => {
      getSearchResults.mockReturnValueOnce(resultPromise);
      let globalQuickSearch = wrapper.find(GlobalQuickSearch);
      await globalQuickSearch.props().onSearch(query, 0);
      await waitForRender(wrapper, 10);

      globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.props().isLoading).toBe(false);

      expect(getSearchResults).toHaveBeenCalledTimes(1);
      expect(getSearchResults.mock.calls[0][0]).toBe(query);
      return wrapper;
    };

    beforeEach(() => {
      getSearchResults = jest.fn();
    });

    it('should handle search', async () => {
      const searchResults = {
        spaces: [
          {
            key: 'space-1',
          },
        ],
      };
      const query = 'query';
      const wrapper = await renderAndWait();
      await search(wrapper, query, Promise.resolve({ results: searchResults }));
      assertLastCall(defaultProps.getSearchResultsComponent, {
        searchResults,
        isLoading: false,
        isError: false,
      });
      assertPostQueryAnalytics(query, searchResults);
    });

    it('should handle error', async () => {
      const query = 'queryWithError';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });
    });

    it('should clear error after new query', async () => {
      const query = 'queryWithError2';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });

      const newQuery = 'newQuery';
      const searchResults = {
        spaces: [
          {
            key: 'space-2',
          },
        ],
      };
      getSearchResults.mockReset();
      await search(
        wrapper,
        newQuery,
        Promise.resolve({ results: searchResults }),
      );
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: false,
        latestSearchQuery: newQuery,
      });
      assertPostQueryAnalytics(newQuery, searchResults);
    });
  });
});
