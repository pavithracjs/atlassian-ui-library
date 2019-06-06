import { messages } from '../../messages';
import { ConfluenceResultsMap, ResultsGroup } from '../../model/Result';
import { attachConfluenceContextIdentifiers } from '../common/contextIdentifiersHelper';
import { take } from '../SearchResultsUtil';
import { getConfluenceMaxObjects } from '../../util/experiment-utils';
import { ConfluenceFeatures } from '../../util/features';

export const DEFAULT_MAX_OBJECTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;
export const MAX_RECENT_RESULTS_TO_SHOW = 3;

const EMPTY_CONFLUENCE_RESULT = {
  people: [],
  objects: [],
  spaces: [],
};

const sliceResults = (
  resultsMap: ConfluenceResultsMap | null,
  features: ConfluenceFeatures,
): ConfluenceResultsMap => {
  if (!resultsMap) {
    return EMPTY_CONFLUENCE_RESULT;
  }
  const { people, objects, spaces } = resultsMap;
  return {
    objects: take(
      objects,
      getConfluenceMaxObjects(features.abTest, DEFAULT_MAX_OBJECTS),
    ),
    spaces: take(spaces, MAX_SPACES),
    people: take(people, MAX_PEOPLE),
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: ConfluenceResultsMap | null,
  features: ConfluenceFeatures,
  searchSessionId: string,
): ResultsGroup[] => {
  const sliced = sliceResults(recentlyViewedObjects, features);

  const { people, objects, spaces } = attachConfluenceContextIdentifiers(
    searchSessionId,
    sliced,
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
  features: ConfluenceFeatures,
  searchSessionId: string,
): ResultsGroup[] => {
  const sliced = sliceResults(searchResultsObjects, features);

  const { people, objects, spaces } = attachConfluenceContextIdentifiers(
    searchSessionId,
    sliced,
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
