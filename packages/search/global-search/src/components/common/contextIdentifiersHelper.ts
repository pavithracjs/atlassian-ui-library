import URI from 'urijs';
import { GenericResultMap, Result } from '../../model/Result';
import { JiraResultQueryParams } from '../../api/types';

const CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME = 'search_id';
const JIRA_SEARCH_SESSION_ID_PARAM_NAME = 'searchSessionId';

/**
 * Apply the given function to the specified keys in the supplied ResultMap
 * @param resultMapperFn function to map results
 * @param keysToMap the keys of the given ResultType to map over
 * @param results the GenericResultMap to apply resultMapperFn to
 */
const mapGenericResultMap = (
  resultMapperFn: (r: Result) => Result,
  keysToMap: string[],
  results: GenericResultMap,
): GenericResultMap => {
  const nonMapped = Object.keys(results)
    .filter(key => !keysToMap.includes(key))
    .reduce((accum, key) => ({ ...accum, [key]: results[key] }), {});

  return Object.keys(results)
    .filter(key => keysToMap.includes(key))
    .reduce(
      (accum, resultType) => ({
        ...accum,
        [resultType]: results[resultType].map(resultMapperFn),
      }),
      {
        ...nonMapped,
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
  return mapGenericResultMap(
    attachSearchSessionIdToResult(
      searchSessionId,
      CONFLUENCE_SEARCH_SESSION_ID_PARAM_NAME,
    ),
    ['objects', 'spaces'],
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

  return mapGenericResultMap(
    r => attachJiraContext(attachSearchSessionId(r)),
    ['objects', 'containers'],
    results,
  );
};
