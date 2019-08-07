import { createFeatures, FeaturesParameters } from '../../features';
import { ABTest, DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

describe('isInFasterSearchExperiment', () => {
  const abTestData = (experimentId: string, abTestId: string): ABTest => ({
    ...DEFAULT_AB_TEST,
    experimentId,
    abTestId,
  });

  const defaultParameters: FeaturesParameters = {
    abTest: DEFAULT_AB_TEST,
    fasterSearchFFEnabled: false,
    useUrsForBootstrapping: false,
    disableJiraPreQueryPeopleSearch: false,
    enablePreQueryFromAggregator: false,
    isAutocompleteEnabled: false,
  };

  it('returns false if part of an experiment that is not faster-search', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('something-else', 'in-ab-test'),
      fasterSearchFFEnabled: true,
    });
    expect(features.isInFasterSearchExperiment).toEqual(false);
  });

  it('returns true if experiment id is equal to faster-search', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('faster-search', 'in-ab-test'),
      fasterSearchFFEnabled: true,
    });
    expect(features.isInFasterSearchExperiment).toEqual(true);
  });

  it('returns true if not part of abtest and the faster search FF is on', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('', 'default'),
      fasterSearchFFEnabled: true,
    });
    expect(features.isInFasterSearchExperiment).toEqual(true);
  });

  it('returns false if not part of abtest is default and the faster search FF is off', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('', 'default'),
      fasterSearchFFEnabled: false,
    });

    expect(features.isInFasterSearchExperiment).toEqual(false);
  });

  it('returns expected value for useUrsForBootstrapping', () => {
    const features = createFeatures({
      ...defaultParameters,
      useUrsForBootstrapping: true,
    });
    expect(features.useUrsForBootstrapping).toEqual(true);
  });

  it('returns expected value for disableJiraPreQueryPeopleSearch', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('', 'default'),
      disableJiraPreQueryPeopleSearch: true,
    });
    expect(features.disableJiraPreQueryPeopleSearch).toEqual(true);
  });

  it('returns expected value for enablePreQueryFromAggregator', () => {
    const features = createFeatures({
      ...defaultParameters,
      abTest: abTestData('', 'default'),
      enablePreQueryFromAggregator: true,
    });
    expect(features.enablePreQueryFromAggregator).toEqual(true);
  });
});
