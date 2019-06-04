import { ABTest } from '../api/CrossProductSearchClient';
import memoizeOne from 'memoize-one';
import deepEqual from 'deep-equal';

const FASTER_SEARCH_EXPERIMENT = 'faster-search';
const DEFAULT = 'default';

const isInFasterSearchExperiment = (
  abTest: ABTest,
  fasterSearchFFEnabled: boolean,
): boolean => {
  return (
    abTest.experimentId === FASTER_SEARCH_EXPERIMENT ||
    (abTest.abTestId === DEFAULT && fasterSearchFFEnabled)
  );
};

export interface CommonFeatures {
  abTest: ABTest;
}

export interface ConfluenceFeatures extends CommonFeatures {
  isInFasterSearchExperiment: boolean;
  useUrsForBootstrapping: boolean;
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
    };
  },
  deepEqual,
);
