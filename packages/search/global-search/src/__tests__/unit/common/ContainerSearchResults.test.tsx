import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import uuid from 'uuid/v4';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import {
  JiraQuickSearchContainer,
  Props as JiraProps,
} from '../../../components/jira/JiraQuickSearchContainer';
import {
  ConfluenceQuickSearchContainer,
  Props as ConfluenceProps,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';

import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
  SearchResultProps,
} from '../../../components/common/QuickSearchContainer';
import {
  noResultsConfluenceClient,
  mockAutocompleteClient,
} from '../mocks/_mockConfluenceClient';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import { mockLogger } from '../mocks/_mockLogger';
import { mockNoResultJiraClient } from '../mocks/_mockJiraClient';
import {
  makeJiraObjectResult,
  makePersonResult,
  makeConfluenceContainerResult,
} from '../_test-util';
import { ContentType } from '../../../model/Result';
import { messages } from '../../../messages';
import * as SearchResultUtils from '../../../components/SearchResultsUtil';
import SearchResultsComponent, {
  Props as SearchResultsComponentProps,
} from '../../../components/common/SearchResults';
import { SearchScreenCounter } from '../../../util/ScreenCounter';
import JiraNoResultsState from '../../../components/jira/NoResultsState';
import ConfluenceNoResultsState from '../../../components/confluence/NoResultsState';
import ConfluenceAdvancedSearchGroup from '../../../components/confluence/AdvancedSearchGroup';
import JiraAdvancedSearchGroup from '../../../components/jira/JiraAdvancedSearch';
import StickyFooter from '../../../components/common/StickyFooter';
import { QuickSearchContext } from '../../../api/types';

const issues = [
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
];
const boards = [
  makeJiraObjectResult({
    contentType: ContentType.JiraBoard,
  }),
];
const spaceResults = [makeConfluenceContainerResult()];
const recentlyInteractedPeople = [makePersonResult()];

const abTest = {
  experimentId: 'test-experiement-id',
  abTestId: 'test-abtest-id',
  controlId: 'test-control-id',
};

const logger = mockLogger();
const createAnalyticsEventSpy = jest.fn();
const renderJiraQuickSearchContainer = (props: JiraProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<JiraQuickSearchContainer {...props} />);
};

const renderConfluenceQuickSearchContainer = (props: ConfluenceProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
};

const renderComponent = (product: QuickSearchContext) => {
  const props = {
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    jiraClient: mockNoResultJiraClient(),
    autocompleteClient: mockAutocompleteClient,
    logger,
    createAnalyticsEvent: createAnalyticsEventSpy,
    confluenceClient: noResultsConfluenceClient,
    useAggregatorForConfluenceObjects: false,
    useCPUSForPeopleResults: false,
    fasterSearchFFEnabled: false,
  };
  return product === 'jira'
    ? renderJiraQuickSearchContainer(props)
    : renderConfluenceQuickSearchContainer(props);
};

const getNoResultsState = (product: QuickSearchContext) =>
  product === 'jira' ? JiraNoResultsState : ConfluenceNoResultsState;

const assertJiraNoRecentActivity = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toEqual(React.Fragment);
  const formattedMessage = props.children[0];
  expect(formattedMessage).toMatchObject({
    type: FormattedHTMLMessage,
    props: {
      id: 'global_search.jira.no_recent_activity_body',
    },
  });

  const advancedSearchSection = props.children[1].props.children;
  expect(advancedSearchSection).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      query: 'query',
      analyticsData: { resultsCount: 0, wasOnNoResultsScreen: true },
    },
  });
};

const assertConfluenceNoRecentActivity = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toBe(FormattedHTMLMessage);
  expect(props).toMatchObject({
    id: 'global_search.no_recent_activity_body',
    values: { url: '/wiki/dosearchsite.action' },
  });
};
const assertNoRecentActivityComponent = (
  product: QuickSearchContext,
  element: JSX.Element,
) => {
  if (product === 'jira') {
    assertJiraNoRecentActivity(element);
  } else {
    assertConfluenceNoRecentActivity(element);
  }
};

const assertJiraAdvancedSearchGroup = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toEqual(StickyFooter);
  expect(props.children).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      analyticsData: { resultsCount: 10 },
      query: 'query',
    },
  });
};

const assertConfluenceAdvancedSearchGroup = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  const analyticsData = { resultsCount: 10 };
  expect(type).toBe(ConfluenceAdvancedSearchGroup);
  expect(props).toMatchObject({
    analyticsData,
    query: 'query',
  });
};
const assertAdvancedSearchGroup = (
  product: QuickSearchContext,
  element: JSX.Element,
) => {
  if (product === 'jira') {
    assertJiraAdvancedSearchGroup(element);
  } else {
    assertConfluenceAdvancedSearchGroup(element);
  }
};

const getSearchAndRecentItems = (
  product: QuickSearchContext,
  sessionId: string,
  extraProps = {},
): SearchResultProps => {
  const commonProps = {
    retrySearch: jest.fn(),
    latestSearchQuery: 'query',
    isError: false,
    isLoading: false,
    keepPreQueryState: false,
    searchSessionId: sessionId,
  };
  if (product === 'jira') {
    return {
      ...commonProps,
      ...extraProps,
      searchResults: {
        objects: issues,
        containers: boards,
      },
      recentItems: {
        objects: [],
        containers: [],
        people: recentlyInteractedPeople,
      },
      abTest,
    };
  }
  return {
    ...commonProps,
    ...extraProps,
    searchResults: {
      objects: [],
      spaces: spaceResults,
    },
    recentItems: {
      objects: [],
      spaces: [],
      people: recentlyInteractedPeople,
    },
    abTest,
  };
};

const getJiraPreqQueryResults = () => [
  {
    items: [],
    key: 'issues',
    title: messages.jira_recent_issues_heading,
  },
  {
    items: [],
    key: 'containers',
    title: messages.jira_recent_containers,
  },
  {
    items: recentlyInteractedPeople,
    title: messages.jira_recent_people_heading,
    key: 'people',
  },
];
const getConfluencePreQueryResults = () => [
  {
    items: [],
    key: 'objects',
    title: messages.confluence_recent_pages_heading,
  },
  {
    items: [],
    key: 'spaces',
    title: messages.confluence_recent_spaces_heading,
  },
  {
    items: recentlyInteractedPeople,
    title: messages.people_recent_people_heading,
    key: 'people',
  },
];

const getJiraPostQueryResults = () => [
  {
    items: issues,
    key: 'issues',
    title: messages.jira_search_result_issues_heading,
  },
  {
    items: [
      {
        analyticsType: 'link-postquery-advanced-search-jira',
        contentType: 'jira-issue',
        href: 'jiraUrl',
        name: 'jira',
        resultId: 'search-jira',
        resultType: 'JiraIssueAdvancedSearch',
      },
    ],
    key: 'issue-advanced',
    title: undefined,
  },
  {
    items: boards,
    key: 'containers',
    title: messages.jira_search_result_containers_heading,
  },
  {
    items: [],
    title: messages.jira_search_result_people_heading,
    key: 'people',
  },
];
const getConfluencePostQueryResults = () => [
  {
    items: [],
    key: 'objects',
    title: messages.confluence_confluence_objects_heading,
  },
  {
    items: spaceResults,
    key: 'spaces',
    title: messages.confluence_spaces_heading,
  },
  {
    items: [],
    title: messages.people_people_heading,
    key: 'people',
  },
];

const getPostQueryResults = (product: QuickSearchContext) =>
  product === 'jira'
    ? getJiraPostQueryResults()
    : getConfluencePostQueryResults();

const getPreqQueryResults = (product: QuickSearchContext) =>
  product === 'jira'
    ? getJiraPreqQueryResults()
    : getConfluencePreQueryResults();

(['confluence', 'jira'] as Array<QuickSearchContext>).forEach(
  (product: QuickSearchContext) => {
    describe(`${product} SearchResultsComponent`, () => {
      let searchResultsComponent: React.ReactNode;
      let getAdvancedSearchUrlSpy: jest.SpyInstance<
        (
          entityType: SearchResultUtils.JiraEntityTypes,
          query?: string | undefined,
        ) => string
      >;
      const wrapper = renderComponent(product);
      const getProps = (): SearchResultsComponentProps => {
        const { props = {} as SearchResultsComponentProps } =
          (searchResultsComponent as React.ReactElement<
            SearchResultsComponentProps
          >) || {};
        return props as SearchResultsComponentProps;
      };

      let sessionId: string;
      beforeEach(() => {
        sessionId = uuid();
        getAdvancedSearchUrlSpy = jest.spyOn(
          SearchResultUtils,
          'getJiraAdvancedSearchUrl',
        );
        getAdvancedSearchUrlSpy.mockReturnValue('confUrl');
        const quickSearchContainer = wrapper.find(QuickSearchContainer);
        searchResultsComponent = (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResultsComponent(
          getSearchAndRecentItems(product, sessionId),
        );
      });

      afterEach(() => {
        getAdvancedSearchUrlSpy.mockRestore();
      });

      it('should has expected props and type', () => {
        const { type = '', props = {} } =
          (searchResultsComponent as React.ReactElement<
            SearchResultsComponentProps
          >) || {};
        expect(type).toBe(SearchResultsComponent);
        expect(props).toMatchObject({
          isPreQuery: false,
          isError: false,
          isLoading: false,
          keepPreQueryState: false,
          searchSessionId: sessionId,
          preQueryScreenCounter: expect.any(SearchScreenCounter),
          postQueryScreenCounter: expect.any(SearchScreenCounter),
        });
      });

      it('should renderNoResult component', () => {
        const { renderNoResult } = getProps();
        const noResultState = renderNoResult();
        const { type = '', props = {} } = (noResultState as JSX.Element) || {};

        expect(type).toBe(getNoResultsState(product));
        expect(props).toMatchObject({
          query: 'query',
        });
      });

      it('should renderNoRecentActivity', () => {
        const { renderNoRecentActivity } = getProps();
        const noRecentActivity = renderNoRecentActivity();
        assertNoRecentActivityComponent(product, noRecentActivity);
      });

      it('should renderAdvancedSearchGroup', () => {
        const { renderAdvancedSearchGroup } = getProps();
        const analyticsData = { resultsCount: 10 };
        const advancedSearchGroup = renderAdvancedSearchGroup(analyticsData);
        assertAdvancedSearchGroup(product, advancedSearchGroup);
      });

      it('should return preQueryGroups', () => {
        const { getPreQueryGroups } = getProps();
        const preQueryGroups = getPreQueryGroups();

        expect(preQueryGroups).toMatchObject(getPreqQueryResults(product));
      });

      it('should return postQueryGroups', () => {
        getAdvancedSearchUrlSpy.mockReturnValue('jiraUrl');
        const { getPostQueryGroups } = getProps();
        const postQueryGroups = getPostQueryGroups();
        expect(postQueryGroups).toMatchObject(getPostQueryResults(product));
      });
    });
  },
);

describe('jira', () => {
  it('should not render lozenge for pre-query screen', () => {
    const wrapper = renderComponent('jira');
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResultsComponent = (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResultsComponent(
      getSearchAndRecentItems('jira', 'abc', { latestSearchQuery: '' }),
    );
    const { props } = searchResultsComponent! as React.ReactElement<
      SearchResultsComponentProps
    >;
    const { renderAdvancedSearchGroup } = props;
    const advancedSearchGroup = renderAdvancedSearchGroup({ resultsCount: 10 });
    expect(advancedSearchGroup.props.children).toMatchObject({
      type: JiraAdvancedSearchGroup,
      props: {
        analyticsData: { resultsCount: 10 },
        query: '',
      },
    });
  });
});
