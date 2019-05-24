import {
  jiraModelParams,
  confluenceModelParams,
} from '../../../util/model-parameters';

describe('model-parameters', () => {
  describe('jira', () => {
    it('works in the empty case', () => {
      const params = jiraModelParams();
      expect(params).toEqual([]);
    });

    it('works with the query version', () => {
      const params = jiraModelParams(undefined, 1);
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });

    it('works with project id', () => {
      const params = jiraModelParams({
        searchReferrerId: 'referrerId',
        currentContentId: 'contentId',
        currentContainerId: 'containerId',
      });
      expect(params).toEqual([
        {
          '@type': 'currentProject',
          projectId: 'containerId',
        },
      ]);
    });
  });

  describe('confluence', () => {
    it('works in the empty case', () => {
      const params = confluenceModelParams();
      expect(params).toEqual([]);
    });

    it('works with the query version', () => {
      const params = confluenceModelParams(undefined, 1);
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });

    it('works with space key', () => {
      const params = confluenceModelParams({
        spaceKey: 'spaceKey',
      });
      expect(params).toEqual([
        {
          '@type': 'currentSpace',
          spaceKey: 'spaceKey',
        },
      ]);
    });
  });
});
