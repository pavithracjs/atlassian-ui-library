import * as React from 'react';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeConfluenceClient,
  mockAutocompleteClient,
} from '../mocks/_mockConfluenceClient';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
} from '../../../components/common/QuickSearchContainer';
import { makeConfluenceObjectResult, makePersonResult } from '../_test-util';
import { Scope } from '../../../api/types';
import {
  Result,
  ConfluenceResultsMap,
  ResultsWithTiming,
} from '../../../model/Result';
import {
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  DEFAULT_AB_TEST,
  CrossProductSearchClient,
  SearchResultsMap,
} from '../../../api/CrossProductSearchClient';
import * as SearchUtils from '../../../components/SearchResultsUtil';

import { mockLogger } from '../mocks/_mockLogger';
import { ReferralContextIdentifiers } from '../../../components/GlobalQuickSearchWrapper';
import { ConfluenceFeatures } from '../../../util/features';

const sessionId = 'sessionId';
const referralContextIdentifiers: ReferralContextIdentifiers = {
  currentContainerId: '123-container',
  currentContentId: '123-content',
  searchReferrerId: '123-search-referrer',
};

const DEFAULT_FEATURES: ConfluenceFeatures = {
  abTest: DEFAULT_AB_TEST,
  isInFasterSearchExperiment: false,
  useUrsForBootstrapping: false,
  searchExtensionsEnabled: false,
  isAutocompleteEnabled: false,
};

function render(partialProps?: Partial<Props>) {
  const logger = mockLogger();
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    autocompleteClient: mockAutocompleteClient,
    logger,
    referralContextIdentifiers,
    features: DEFAULT_FEATURES,
    firePrivateAnalyticsEvent: undefined,
    createAnalyticsEvent: undefined,
    inputControls: undefined,
    onAdvancedSearch: undefined,
    linkComponent: undefined,
    modelContext: undefined,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
}

const mockCrossProductSearchClient = {
  search(query: string, sessionId: string, scopes: Scope[]) {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE) as any;
  },
  getAbTestDataForProduct() {
    return Promise.resolve(DEFAULT_AB_TEST) as any;
  },
  getAbTestData(scope: Scope) {
    return Promise.resolve(DEFAULT_AB_TEST) as any;
  },
  getPeople() {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
  },
} as CrossProductSearchClient;

const mockSingleResultPromise = (scope: Scope, result: Result) => {
  const results = {} as SearchResultsMap;
  results[scope] = {
    items: [result],
    totalSize: 1,
  };

  return Promise.resolve({
    results: results,
  });
};

describe('ConfluenceQuickSearchContainer', () => {
  it('should render QuickSearchContainer with correct props', () => {
    const wrapper = render();
    const quickSearchContainer = wrapper.find(QuickSearchContainer);

    const props = quickSearchContainer.props();
    expect(props).toHaveProperty('getSearchResultsComponent');
  });

  it('should return recent viewed items', async () => {
    const mockConfluenceClient = makeConfluenceClient({
      getRecentItems() {
        return Promise.resolve([makeConfluenceObjectResult()]);
      },
    });

    const wrapper = render({
      confluenceClient: mockConfluenceClient,
    });
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const requiredRecents = await (quickSearchContainer.props() as QuickSearchContainerProps<
      ConfluenceResultsMap
    >).getRecentItems('session_id').eagerRecentItemsPromise;

    expect(requiredRecents).toMatchObject({
      results: {
        objects: {
          items: [
            {
              analyticsType: 'result-confluence',
              resultType: 'confluence-object-result',
              containerName: 'containerName',
              contentType: 'confluence-page',
              containerId: 'containerId',
              name: 'name',
              avatarUrl: 'avatarUrl',
              href: 'href',
              resultId: 'resultId',
            },
          ],
          totalSize: 1,
        },
        spaces: {
          items: [],
          totalSize: 0,
        },
        people: {
          items: [],
          totalSize: 0,
        },
      },
    } as ResultsWithTiming<ConfluenceResultsMap>);
  });

  it('should return recent items using the crossproduct search when prefetching is on ', async () => {
    const wrapper = render({
      features: { ...DEFAULT_FEATURES, useUrsForBootstrapping: true },
      crossProductSearchClient: {
        ...mockCrossProductSearchClient,
        getPeople() {
          return mockSingleResultPromise(
            Scope.UserConfluence,
            makePersonResult(),
          );
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const recentsPromise = (quickSearchContainer.props() as QuickSearchContainerProps<
      ConfluenceResultsMap
    >).getRecentItems('session_id');
    const requiredRecents = await recentsPromise.eagerRecentItemsPromise;
    const peopleRecents = await recentsPromise.lazyLoadedRecentItemsPromise;

    expect(requiredRecents).toEqual({
      results: {
        people: {
          items: [],
          totalSize: 0,
        },
        objects: {
          items: [],
          totalSize: 0,
        },
        spaces: {
          items: [],
          totalSize: 0,
        },
      },
    } as ResultsWithTiming<ConfluenceResultsMap>);

    expect(peopleRecents).toEqual({
      people: {
        items: [
          {
            mentionName: 'mentionName',
            presenceMessage: 'presenceMessage',
            analyticsType: 'result-person',
            resultType: 'person-result',
            contentType: 'person',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
            resultId: expect.any(String),
          },
        ],
        totalSize: 1,
      },
    } as Partial<ConfluenceResultsMap>);
  });

  it('should return recent items using the crossproduct search when prefetching is off', async () => {
    const wrapper = render({
      features: { ...DEFAULT_FEATURES, useUrsForBootstrapping: false },
      peopleSearchClient: {
        getRecentPeople() {
          return Promise.resolve([makePersonResult()]);
        },
        search() {
          return Promise.resolve([]);
        },
      },
      crossProductSearchClient: {
        search(query: string, sessionId: string, scopes: Scope[]) {
          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getAbTestDataForProduct() {
          return Promise.resolve(DEFAULT_AB_TEST);
        },
        getAbTestData(scope: Scope) {
          return Promise.resolve(DEFAULT_AB_TEST);
        },
        getPeople() {
          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const recentsPromise = (quickSearchContainer.props() as QuickSearchContainerProps<
      ConfluenceResultsMap
    >).getRecentItems('session_id');
    const requiredRecents = await recentsPromise.eagerRecentItemsPromise;
    const peopleRecents = await recentsPromise.lazyLoadedRecentItemsPromise;

    expect(requiredRecents).toEqual({
      results: {
        people: {
          items: [],
          totalSize: 0,
        },
        objects: {
          items: [],
          totalSize: 0,
        },
        spaces: {
          items: [],
          totalSize: 0,
        },
      },
    } as ResultsWithTiming<ConfluenceResultsMap>);

    expect(peopleRecents).toEqual({
      people: {
        items: [
          {
            mentionName: 'mentionName',
            presenceMessage: 'presenceMessage',
            analyticsType: 'result-person',
            resultType: 'person-result',
            contentType: 'person',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
            resultId: expect.any(String),
          },
        ],
        totalSize: 1,
      },
    } as Partial<ConfluenceResultsMap>);
  });

  it('should call cross product search client with correct query version', async () => {
    const searchSpy = jest.spyOn(noResultsCrossProductSearchClient, 'search');
    const dummyQueryVersion = 123;
    const dummySpaceKey = 'abc123';

    const modelParams = [
      {
        '@type': 'queryParams',
        queryVersion: dummyQueryVersion,
      },
      {
        '@type': 'currentSpace',
        spaceKey: dummySpaceKey,
      },
    ];

    const wrapper = render({
      confluenceClient: noResultsConfluenceClient,
      crossProductSearchClient: noResultsCrossProductSearchClient,
      modelContext: {
        spaceKey: dummySpaceKey,
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    (quickSearchContainer.props() as QuickSearchContainerProps<
      ConfluenceResultsMap
    >).getSearchResults('query', sessionId, 100, dummyQueryVersion);

    expect(searchSpy).toHaveBeenCalledWith(
      'query',
      sessionId,
      expect.any(Array),
      modelParams,
      null,
    );

    searchSpy.mockRestore();
  });

  it('should return search result', async () => {
    const wrapper = render({
      crossProductSearchClient: {
        ...mockCrossProductSearchClient,
        search(query: string, sessionId: string, scopes: Scope[]) {
          // only return items when People scope is set
          if (scopes.find(s => s === Scope.People)) {
            return mockSingleResultPromise(Scope.People, makePersonResult());
          }

          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getPeople() {
          return mockSingleResultPromise(
            Scope.UserConfluence,
            makePersonResult(),
          );
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps<
      ConfluenceResultsMap
    >).getSearchResults('query', sessionId, 100, 0);

    expect(searchResults).toEqual({
      results: {
        people: {
          items: [
            {
              mentionName: 'mentionName',
              presenceMessage: 'presenceMessage',
              analyticsType: 'result-person',
              resultType: 'person-result',
              contentType: 'person',
              name: 'name',
              avatarUrl: 'avatarUrl',
              href: 'href',
              resultId: expect.any(String),
            },
          ],
          totalSize: 1,
        },
        objects: {
          items: [],
          totalSize: 0,
        },
        spaces: {
          items: [],
          totalSize: 0,
        },
      },
      timings: {
        confSearchElapsedMs: expect.any(Number),
      },
    } as ResultsWithTiming<ConfluenceResultsMap>);
  });

  describe('Advanced Search callback', () => {
    let redirectSpy: jest.SpyInstance<(query?: string) => void>;
    let originalWindowLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = Object.assign({}, window.location, {
        assign: jest.fn(),
      });
      redirectSpy = jest.spyOn(
        SearchUtils,
        'redirectToConfluenceAdvancedSearch',
      );
    });

    afterEach(() => {
      redirectSpy.mockReset();
      redirectSpy.mockRestore();
      window.location = originalWindowLocation;
    });

    const mountComponent = (spy: jest.Mock<{}>) => {
      const wrapper = render({
        onAdvancedSearch: spy,
      });
      const quickSearchContainer = wrapper.find(QuickSearchContainer);

      const props = quickSearchContainer.props();
      expect(props).toHaveProperty('handleSearchSubmit');

      return (props as any)['handleSearchSubmit'];
    };
    const mockEvent = () => ({
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      target: {
        value: 'query',
      },
    });
    const mockSearchSessionId = 'someSearchSessionId';

    it('should call onAdvancedSearch call', () => {
      const spy = jest.fn();
      const handleSearchSubmit = mountComponent(spy);
      const mockedEvent = mockEvent();
      handleSearchSubmit(mockedEvent, mockSearchSessionId);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          preventDefault: expect.any(Function),
        }),
        'content',
        'query',
        mockSearchSessionId,
      );
      expect(mockedEvent.preventDefault).toHaveBeenCalledTimes(0);
      expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(0);
      expect(redirectSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call redriect', () => {
      const spy = jest.fn(e => e.preventDefault());
      const handleSearchSubmit = mountComponent(spy);
      const mockedEvent = mockEvent();
      handleSearchSubmit(mockedEvent, mockSearchSessionId);

      expect(mockedEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect(redirectSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Autocomplete', () => {
    it('should not pass down getAutocomplete if isAutocompleteEnabled is false', () => {
      const wrapper = render();
      const quickSearchContainer = wrapper.find(QuickSearchContainer);

      const props = quickSearchContainer.props();
      expect(props.getAutocompleteSuggestions).toBeUndefined();
    });

    it('should pass down getAutocomplete if isAutocompleteEnabled', () => {
      const wrapper = render({
        features: { ...DEFAULT_FEATURES, isAutocompleteEnabled: true },
      });
      const quickSearchContainer = wrapper.find(QuickSearchContainer);
      const props = quickSearchContainer.props();
      expect(props.getAutocompleteSuggestions).not.toBeUndefined();
    });
  });
});
