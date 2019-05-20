import URI from 'urijs';
import { GenericResultMap, Result } from '../../model/Result';
import { JiraResultQueryParams } from '../../api/types';

const CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME = 'search_id';
const JIRA_SEARCH_SESSION_ID_PARAM_NAME = 'searchSessionId';

/**
 * Apply the given function to every result in the supplied ResultMap, but not people
 * @param resultMapperFn function to map results
 * @param results the GenericResultMap to apply fn to
 */
const mapObjectsAndContainers = (
  resultMapperFn: (r: Result) => Result,
  results: GenericResultMap,
): GenericResultMap => {
  return Object.keys(results)
    .filter(key => key !== 'people')
    .reduce(
      (accum, resultType) => ({
        ...accum,
        [resultType]: results[resultType].map(resultMapperFn),
      }),
      {
        people: results.people,
      },
    );
};

const attachSearchSessionIdToResult = (
  searchSessionId: string,
  searchSessionIdParamName: string,
) => (result: Result) => {
  const href = new URI(result.href);
  href.addQuery(searchSessionIdParamName, searchSessionId);

  return {
    ...result,
    href: href.toString(),
  };
};

export const attachConfluenceContextIdentifiers = (
  searchSessionId: string,
  results: GenericResultMap,
): GenericResultMap => {
  return mapObjectsAndContainers(
    attachSearchSessionIdToResult(
      searchSessionId,
      CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME,
    ),
    results,
  );
};

export const attachJiraContextIdentifiers = (
  searchSessionId: string,
  results: GenericResultMap,
) => {
  const attachSearchSessionId = attachSearchSessionIdToResult(
    searchSessionId,
    JIRA_SEARCH_SESSION_ID_PARAM_NAME,
  );

  const attachJiraContext = (result: Result) => {
    const href = new URI(result.href);
    if (result.containerId) {
      href.addQuery('containerId', result.containerId);
    }
    href.addQuery('searchContentType', result.contentType.replace(
      'jira-',
      '',
    ) as JiraResultQueryParams['searchContentType']);
    href.addQuery('searchObjectId', result.resultId);

    return {
      ...result,
      href: href.toString(),
    };
  };

  return mapObjectsAndContainers(
    r => attachJiraContext(attachSearchSessionId(r)),
    results,
  );
};
