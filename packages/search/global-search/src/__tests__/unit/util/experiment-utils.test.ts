import { isInFasterSearchExperiment } from '../../../util/experiment-utils';
import { ABTest, DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

describe('experiment-utils', () => {
  const abTestData = (experimentId: string, abTestId: string): ABTest => ({
    ...DEFAULT_AB_TEST,
    experimentId,
    abTestId,
  });

  describe('isInFasterSearchExperiment', () => {
    it('returns false if part of an experiment that is not faster-search', () => {
      const result = isInFasterSearchExperiment(
        abTestData('something-else', 'in-ab-test'),
        true,
      );
      expect(result).toEqual(false);
    });

    it('returns true if experiment id is equal to faster-search', () => {
      const result = isInFasterSearchExperiment(
        abTestData('faster-search', 'in-ab-test'),
        true,
      );
      expect(result).toEqual(true);
    });

    it('returns true if not part of abtest and the faster search FF is on', () => {
      const result = isInFasterSearchExperiment(
        abTestData('', 'default'),
        true,
      );
      expect(result).toEqual(true);
    });

    it('returns false if not part of abtest is default and the faster search FF is off', () => {
      const result = isInFasterSearchExperiment(
        abTestData('', 'default'),
        false,
      );
      expect(result).toEqual(false);
    });
  });
});
