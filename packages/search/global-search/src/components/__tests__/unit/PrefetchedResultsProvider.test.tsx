import { mount } from 'enzyme';
import * as React from 'react';
import { QuickSearchContext } from '../../../api/types';
import { mockConfluencePrefetchedData } from '../../../__tests__/unit/mocks/_mockPrefetchResults';

jest.doMock('../../../api/prefetchResults', () => ({
  getConfluencePrefetchedData: mockConfluencePrefetchedData,
}));

import PrefetchedResultsProvider, {
  GlobalSearchPreFetchContext,
} from '../../PrefetchedResultsProvider';

import {
  getConfluencePrefetchedData,
  ConfluencePrefetchedResults,
} from '../../../api/prefetchResults';

function render(
  context: QuickSearchContext,
  childComponent: JSX.Element,
  cloudId: string | null,
) {
  return mount(
    // @ts-ignore (cloud id can be null when passed in from javascript code)
    <PrefetchedResultsProvider context={context} cloudId={cloudId}>
      {childComponent}
    </PrefetchedResultsProvider>,
  );
}

describe('PrefetchedResultsProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('confluence', () => {
    const context = 'confluence';
    let cloudId = 'cloudId';
    let prefetchedResultsHelper: jest.Mock;

    beforeEach(() => {
      prefetchedResultsHelper = jest.fn();
      const child = (
        <GlobalSearchPreFetchContext.Consumer>
          {prefetchedResults => {
            prefetchedResultsHelper(prefetchedResults);
            return <div />;
          }}
        </GlobalSearchPreFetchContext.Consumer>
      );

      render(context, child, cloudId);
    });

    it('should get confluence prefetch data', async () => {
      expect(getConfluencePrefetchedData).toHaveBeenCalled();

      const results = (getConfluencePrefetchedData as jest.Mock).mock.results[0]
        .value as ConfluencePrefetchedResults;

      const promiseResult = await results.confluenceRecentItemsPromise;

      expect(promiseResult.objects).toBeTruthy();
      expect(promiseResult.people).toBeTruthy();
      expect(promiseResult.spaces).toBeTruthy();
    });

    it('should get ab test prefetch data', async () => {
      expect(getConfluencePrefetchedData).toHaveBeenCalled();

      const results = (getConfluencePrefetchedData as jest.Mock).mock.results[0]
        .value as ConfluencePrefetchedResults;

      const promiseResult = await results.abTestPromise;

      expect(promiseResult).toBeTruthy();
    });
  });

  it('should not pre fetch if no cloud id is supplied', async () => {
    const cloudId = null;
    const child = <div />;

    render('confluence', child, cloudId);

    expect(getConfluencePrefetchedData).not.toHaveBeenCalled();
  });
});
