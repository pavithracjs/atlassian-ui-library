import { createFeatures, FeaturesParameters } from '../../features';
import { ABTest, DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

describe('features', () => {
  const abTestData = (experimentId: string, abTestId: string): ABTest => ({
    ...DEFAULT_AB_TEST,
    experimentId,
    abTestId,
  });

  const defaultParameters: FeaturesParameters = {
    abTest: DEFAULT_AB_TEST,
    useUrsForBootstrapping: false,
    disableJiraPreQueryPeopleSearch: false,
    enablePreQueryFromAggregator: false,
    isAutocompleteEnabled: false,
    isNavAutocompleteEnabled: false,
  };

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
});
