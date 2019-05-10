import * as React from 'react';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import {
  noResultsCrossProductSearchClient,
  singleResultCrossProductSearchClient,
} from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeConfluenceClient,
  singleResultQuickNav,
} from '../mocks/_mockConfluenceClient';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
} from '../../../components/common/QuickSearchContainer';
import { makeConfluenceObjectResult, makePersonResult } from '../_test-util';
import { Scope } from '../../../api/types';
import { Result } from '../../../model/Result';
import {
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  ABTest,
  DEFAULT_AB_TEST,
} from '../../../api/CrossProductSearchClient';
import * as SearchUtils from '../../../components/SearchResultsUtil';

import { mockLogger } from '../mocks/_mockLogger';
import { ReferralContextIdentifiers } from '../../../components/GlobalQuickSearchWrapper';

const sessionId = 'sessionId';
const referralContextIdentifiers: ReferralContextIdentifiers = {
  currentContainerId: '123-container',
  currentContentId: '123-content',
  searchReferrerId: '123-search-referrer',
};

function render(partialProps?: Partial<Props>) {
  const logger = mockLogger();
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    fasterSearchFFEnabled: false,
    logger,
    referralContextIdentifiers,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
}

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
    const recentItems = await (quickSearchContainer.props() as QuickSearchContainerProps).getRecentItems(
      sessionId,
    );
    expect(recentItems).toMatchObject({
      results: {
        objects: [
          {
            analyticsType: 'result-confluence',
            resultType: 'confluence-object-result',
            containerName: 'containerName',
            contentType: 'confluence-page',
            containerId: 'containerId',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
          },
        ],
        spaces: [],
        people: [],
      },
    });
  });

  it('should call cross product search client with correct query version', async () => {
    const searchSpy = jest.spyOn(noResultsCrossProductSearchClient, 'search');
    const dummyQueryVersion = 123;

    const wrapper = render({
      confluenceClient: noResultsConfluenceClient,
      crossProductSearchClient: noResultsCrossProductSearchClient,
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
      dummyQueryVersion,
    );

    expect(searchSpy).toHaveBeenCalledWith(
      'query',
      sessionId,
      expect.any(Array),
      'confluence',
      dummyQueryVersion,
      null,
      referralContextIdentifiers,
    );

    searchSpy.mockRestore();
  });

  it('should return ab test data', async () => {
    const abTest: ABTest = {
      abTestId: 'abTestId',
      experimentId: 'experimentId',
      controlId: 'controlId',
    };

    const wrapper = render({
      confluenceClient: noResultsConfluenceClient,
      crossProductSearchClient: {
        search(query: string) {
          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getAbTestData() {
          return Promise.resolve(abTest);
        },
      },
    });
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const receivedAbTest = await (quickSearchContainer.props() as QuickSearchContainerProps).getAbTestData(
      sessionId,
    );

    expect(receivedAbTest).toMatchObject(abTest);
  });

  it('should return search result', async () => {
    const wrapper = render({
      crossProductSearchClient: {
        search(query: string, sessionId: string, scopes: Scope[]) {
          // only return items when People scope is set
          if (scopes.find(s => s === Scope.People)) {
            const results = new Map<Scope, Result[]>();
            results.set(Scope.People, [makePersonResult()]);

            return Promise.resolve({
              results: results,
            });
          }

          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getAbTestData(scope: Scope) {
          return Promise.resolve(DEFAULT_AB_TEST);
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
      0,
    );

    expect(searchResults).toEqual({
      results: {
        people: [
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
        objects: [],
        spaces: [],
      },
      timings: {
        confSearchElapsedMs: expect.any(Number),
      },
    });
  });

  describe('Advanced Search callback', () => {
    let redirectSpy: jest.SpyInstance<(query?: string) => void>;
    let originalWindowAssign = window.location.assign;

    beforeEach(() => {
      window.location.assign = jest.fn();
      redirectSpy = jest.spyOn(
        SearchUtils,
        'redirectToConfluenceAdvancedSearch',
      );
    });

    afterEach(() => {
      redirectSpy.mockReset();
      redirectSpy.mockRestore();
      window.location.assign = originalWindowAssign;
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
});
