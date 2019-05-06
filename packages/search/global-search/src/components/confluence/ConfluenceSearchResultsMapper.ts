import { ResultsGroup, ConfluenceResultsMap } from '../../model/Result';
import { take } from '../SearchResultsUtil';
import { messages } from '../../messages';
import { ABTest } from '../../api/CrossProductSearchClient';

export const DEFAULT_MAX_OBJECTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

const EMPTY_CONFLUENCE_RESULT = {
  people: [],
  objects: [],
  spaces: [],
};

/**
 * Grape is an experiment to increase the number of search results shown to the user
 */
const GRAPE_EXPERIMENT = 'grape';

const getMaxObjects = (abTest: ABTest) => {
  if (abTest.experimentId.startsWith(GRAPE_EXPERIMENT)) {
    const parsedMaxObjects = Number.parseInt(
      abTest.experimentId.split('-')[1],
      10,
    );

    return parsedMaxObjects || DEFAULT_MAX_OBJECTS;
  }
  return DEFAULT_MAX_OBJECTS;
};

export const sliceResults = (
  resultsMap: ConfluenceResultsMap | null,
  abTest: ABTest,
): ConfluenceResultsMap => {
  if (!resultsMap) {
    return EMPTY_CONFLUENCE_RESULT;
  }
  const { people, objects, spaces } = resultsMap;
  return {
    objects: take(objects, getMaxObjects(abTest)),
    spaces: take(spaces, MAX_SPACES),
    people: take(people, MAX_PEOPLE),
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: ConfluenceResultsMap | null,
  abTest: ABTest,
): ResultsGroup[] => {
  const { people, objects, spaces } = sliceResults(
    recentlyViewedObjects,
    abTest,
  );

  return [
    {
      items: objects,
      key: 'objects',
      title: messages.confluence_recent_pages_heading,
    },
    {
      items: spaces,
      key: 'spaces',
      title: messages.confluence_recent_spaces_heading,
    },
    {
      items: people,
      key: 'people',
      title: messages.people_recent_people_heading,
    },
  ];
};

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: ConfluenceResultsMap | null,
  abTest: ABTest,
): ResultsGroup[] => {
  const { people, objects, spaces } = sliceResults(
    searchResultsObjects,
    abTest,
  );
  return [
    {
      items: objects,
      key: 'objects',
      title: messages.confluence_confluence_objects_heading,
    },
    {
      items: spaces,
      key: 'spaces',
      title: messages.confluence_spaces_heading,
    },
    {
      items: people,
      key: 'people',
      title: messages.people_people_heading,
    },
  ];
};
