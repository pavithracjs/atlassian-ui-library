import {
  attachConfluenceContextIdentifiers,
  attachJiraContextIdentifiers,
} from '../../../components/common/contextIdentifiersHelper';
import {
  AnalyticsType,
  ConfluenceResultsMap,
  ContentType,
  GenericResultMap,
  ResultType,
  Result,
} from '../../../model/Result';

const searchSessionId = 'searchSessionId';

const confluenceBaseResults: ConfluenceResultsMap = {
  objects: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      analyticsType: AnalyticsType.RecentConfluence,
      resultType: ResultType.ConfluenceObjectResult,
      contentType: ContentType.ConfluencePage,
    },
  ],
  spaces: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      analyticsType: AnalyticsType.RecentConfluence,
      resultType: ResultType.GenericContainerResult,
      contentType: ContentType.ConfluenceSpace,
    },
  ],
  people: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      analyticsType: AnalyticsType.RecentPerson,
      resultType: ResultType.PersonResult,
      contentType: ContentType.Person,
    },
  ],
};

const getJiraBaseResults = (result?: Partial<Result>): GenericResultMap => ({
  objects: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      containerId: 'containerId',
      analyticsType: AnalyticsType.RecentJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
      ...result,
    },
  ],
  containers: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      containerId: 'containerId',
      analyticsType: AnalyticsType.RecentJira,
      resultType: ResultType.JiraProjectResult,
      contentType: ContentType.JiraProject,
      ...result,
    },
  ],
  people: [
    {
      resultId: 'resultId',
      name: 'name',
      href: 'http://localhost/',
      containerId: 'containerId',
      analyticsType: AnalyticsType.RecentPerson,
      resultType: ResultType.PersonResult,
      contentType: ContentType.Person,
      ...result,
    },
  ],
});

describe('searchSessionUtils', () => {
  it('attaches the search session id in confluence', () => {
    const { objects, spaces, people } = attachConfluenceContextIdentifiers(
      searchSessionId,
      confluenceBaseResults,
    );

    expect(objects.map(o => o.href)).toEqual([
      'http://localhost/?search_id=searchSessionId',
    ]);
    expect(spaces.map(o => o.href)).toEqual([
      'http://localhost/?search_id=searchSessionId',
    ]);
    expect(people.map(o => o.href)).toEqual(['http://localhost/']);
  });

  it('attaches the search session id and others in jira', () => {
    const { objects, containers, people } = attachJiraContextIdentifiers(
      searchSessionId,
      getJiraBaseResults(),
    );

    expect(objects.map(o => o.href)).toEqual([
      'http://localhost/?searchSessionId=searchSessionId&containerId=containerId&searchContentType=issue&searchObjectId=resultId',
    ]);
    expect(containers.map(o => o.href)).toEqual([
      'http://localhost/?searchSessionId=searchSessionId&containerId=containerId&searchContentType=project&searchObjectId=resultId',
    ]);
    expect(people.map(o => o.href)).toEqual(['http://localhost/']);
  });

  it('attaches everything but not the container id jira', () => {
    const { objects, containers, people } = attachJiraContextIdentifiers(
      searchSessionId,
      getJiraBaseResults({ containerId: undefined }),
    );

    expect(objects.map(o => o.href)).toEqual([
      'http://localhost/?searchSessionId=searchSessionId&searchContentType=issue&searchObjectId=resultId',
    ]);
    expect(containers.map(o => o.href)).toEqual([
      'http://localhost/?searchSessionId=searchSessionId&searchContentType=project&searchObjectId=resultId',
    ]);
    expect(people.map(o => o.href)).toEqual(['http://localhost/']);
  });
});
