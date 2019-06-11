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
export const ITEMS_PER_PAGE = DEFAULT_MAX_OBJECTS;
export const MAX_PAGE_COUNT = 3;

const EMPTY_CONFLUENCE_RESULT = {
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
    objects: {
      ...objects,
      items: take(
        objects.items,
        getConfluenceMaxObjects(
          features.abTest,
          ITEMS_PER_PAGE * (objects.currentPage || 1),
        ),
      ),
      currentPage: 1,
    },
    spaces: {
      ...spaces,
      items: take(spaces.items, MAX_SPACES),
      currentPage: 1,
    },
    people: {
      ...people,
      items: take(people.items, MAX_PEOPLE),
      currentPage: 1,
    },
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
      items: objects.items,
      key: 'objects',
      title: messages.confluence_recent_pages_heading,
      totalSize: objects.totalSize,
      showTotalSize: false,
    },
    {
      items: spaces.items,
      key: 'spaces',
      title: messages.confluence_recent_spaces_heading,
      totalSize: spaces.totalSize,
      showTotalSize: false,
    },
    {
      items: people.items,
      key: 'people',
      title: messages.people_recent_people_heading,
      totalSize: people.totalSize,
      showTotalSize: false,
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
      items: objects.items,
      key: 'objects',
      title: messages.confluence_confluence_objects_heading,
      totalSize: objects.totalSize,
      showTotalSize: features.searchExtensionsEnabled,
    },
    {
      items: spaces.items,
      key: 'spaces',
      title: messages.confluence_spaces_heading,
      totalSize: spaces.totalSize,
      showTotalSize: false,
    },
    {
      items: people.items,
      key: 'people',
      title: messages.people_people_heading,
      totalSize: people.totalSize,
      showTotalSize: false,
    },
  ];
};
