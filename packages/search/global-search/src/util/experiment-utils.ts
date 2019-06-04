import { ABTest } from '../api/CrossProductSearchClient';

/**
 * Grape is an experiment to increase the number of search results shown to the user
 */
const CONFLUENCE_GRAPE_EXPERIMENT = 'grape';
const JIRA_GRAPE_EXPERIMENT = 'grape';

export const getJiraMaxObjects = (abTest: ABTest, defaultMaxObjects: number) =>
  getMaxObjects(abTest, JIRA_GRAPE_EXPERIMENT, defaultMaxObjects);

export const getConfluenceMaxObjects = (
  abTest: ABTest,
  defaultMaxObjects: number,
) => getMaxObjects(abTest, CONFLUENCE_GRAPE_EXPERIMENT, defaultMaxObjects);

const getMaxObjects = (
  abTest: ABTest,
  experimentIdPrefix: string,
  defaultMaxObjects: number,
): number => {
  if (abTest.experimentId.startsWith(experimentIdPrefix)) {
    const parsedMaxObjects = Number.parseInt(
      abTest.experimentId.split('-')[1],
      10,
    );

    return parsedMaxObjects || defaultMaxObjects;
  }
  return defaultMaxObjects;
};
