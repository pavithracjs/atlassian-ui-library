import {
  buildJiraModelParams,
  buildConfluenceModelParams,
} from '../../../util/model-parameters';

describe('model-parameters', () => {
  describe('jira', () => {
    it('works in the empty case', () => {
      const params = buildJiraModelParams();
      expect(params).toEqual([]);
    });

    it('works with the query version', () => {
      const params = buildJiraModelParams(undefined, 1);
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });

    it('works with project id', () => {
      const params = buildJiraModelParams({
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
      const params = buildConfluenceModelParams();
      expect(params).toEqual([]);
    });

    it('works with the query version', () => {
      const params = buildConfluenceModelParams(undefined, 1);
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });

    it('works with space key', () => {
      const params = buildConfluenceModelParams({
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
