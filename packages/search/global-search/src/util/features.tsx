import { ABTest } from '../api/CrossProductSearchClient';
import memoizeOne from 'memoize-one';
import deepEqual from 'deep-equal';

const FASTER_SEARCH_EXPERIMENT = 'faster-search';
const DEFAULT = 'default';
const SEARCH_EXTENSIONS_EXPERIMENT = 'search-extensions-simple';
const SEARCH_EXTENSIONS_COMPLEX_EXPERIMENT = 'search-extensions-complex';

const isInFasterSearchExperiment = (
  abTest: ABTest,
  fasterSearchFFEnabled: boolean,
): boolean => {
  return (
    abTest.experimentId === FASTER_SEARCH_EXPERIMENT ||
    (abTest.abTestId === DEFAULT && fasterSearchFFEnabled)
  );
};

const isInSearchExtensionsExperiment = (abTest: ABTest): boolean => {
  return abTest.experimentId === SEARCH_EXTENSIONS_EXPERIMENT;
};

const isInSearchExtensionsComplexExperiment = (abTest: ABTest): boolean => {
  return abTest.experimentId === SEARCH_EXTENSIONS_COMPLEX_EXPERIMENT;
};

export interface CommonFeatures {
  abTest: ABTest;
  searchExtensionsEnabled: boolean;
}

export interface ConfluenceFeatures extends CommonFeatures {
  isInFasterSearchExperiment: boolean;
  useUrsForBootstrapping: boolean;
  isAutocompleteEnabled: boolean;
  complexSearchExtensionsEnabled: boolean;
}

export interface JiraFeatures extends CommonFeatures {
  disableJiraPreQueryPeopleSearch: boolean;
  enablePreQueryFromAggregator: boolean;
}

export interface FeaturesParameters {
  abTest: ABTest;
  fasterSearchFFEnabled: boolean;
  useUrsForBootstrapping: boolean;
  disableJiraPreQueryPeopleSearch: boolean;
  enablePreQueryFromAggregator: boolean;
  isAutocompleteEnabled: boolean;
}

export const createFeatures: (
  parameters: FeaturesParameters,
) => ConfluenceFeatures & JiraFeatures = memoizeOne(
  ({
    abTest,
    fasterSearchFFEnabled,
    useUrsForBootstrapping,
    disableJiraPreQueryPeopleSearch,
    enablePreQueryFromAggregator,
    isAutocompleteEnabled,
  }) => {
    return {
      abTest,
      isInFasterSearchExperiment: isInFasterSearchExperiment(
        abTest,
        fasterSearchFFEnabled,
      ),
      useUrsForBootstrapping,
      disableJiraPreQueryPeopleSearch,
      enablePreQueryFromAggregator,
      searchExtensionsEnabled: isInSearchExtensionsExperiment(abTest),
      isAutocompleteEnabled,
      complexSearchExtensionsEnabled: isInSearchExtensionsComplexExperiment(
        abTest,
      ),
    };
  },
  deepEqual,
);
