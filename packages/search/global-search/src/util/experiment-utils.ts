import { ABTest } from '../api/CrossProductSearchClient';

const FASTER_SEARCH_EXPERIMENT = 'faster-search';
const DEFAULT = 'default';

export const isInFasterSearchExperiment = (
  abTest: ABTest,
  fasterSearchFFEnabled: boolean,
): boolean =>
  abTest.experimentId === FASTER_SEARCH_EXPERIMENT ||
  (abTest.abTestId === DEFAULT && fasterSearchFFEnabled);
