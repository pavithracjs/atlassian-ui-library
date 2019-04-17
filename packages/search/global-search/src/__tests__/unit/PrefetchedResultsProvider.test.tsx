import { mount } from 'enzyme';
import * as React from 'react';
import PrefetchedResultsProvider, {
  GlobalSearchPreFetchContext,
} from '../../components/PrefetchedResultsProvider';

import {
  // @ts-ignore (additional export from mocked version)
  confluenceRecentItemsPromise,
  // @ts-ignore (additional export from mocked version)
  abTestPromise,
  // @ts-ignore (additional export from mocked version)
  recentPeoplePromise,
  getConfluencePrefetchedData,
} from '../../api/prefetchResults';
import { QuickSearchContext } from '../../api/types';

jest.mock('../../api/prefetchResults');

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
    // @ts-ignore
    getConfluencePrefetchedData.mockClear();
  });

  describe('confluence', () => {
    const context = 'confluence';
    let cloudId = 'cloudId';
    let prefetchedResultsHelper: jest.Mock;

    beforeEach(() => {
      prefetchedResultsHelper = jest.fn();
      const child = (
        <GlobalSearchPreFetchContext.Consumer>
          {({ prefetchedResults }) => {
            prefetchedResultsHelper(prefetchedResults);
            return <div />;
          }}
        </GlobalSearchPreFetchContext.Consumer>
      );

      render(context, child, cloudId);
    });

    it('should get confluence prefetch data', async () => {
      await confluenceRecentItemsPromise;

      expect(getConfluencePrefetchedData).toHaveBeenCalled();
      expect(
        prefetchedResultsHelper.mock.calls[1][0].confluenceRecentItemsPromise,
      ).toEqual(confluenceRecentItemsPromise);
    });

    it('should get ab test prefetch data', async () => {
      await confluenceRecentItemsPromise;

      expect(getConfluencePrefetchedData).toHaveBeenCalled();
      expect(prefetchedResultsHelper.mock.calls[1][0].abTestPromise).toEqual(
        abTestPromise,
      );
    });

    it('should get recent people prefetch data', async () => {
      await confluenceRecentItemsPromise;

      expect(getConfluencePrefetchedData).toHaveBeenCalled();
      expect(
        prefetchedResultsHelper.mock.calls[1][0].recentPeoplePromise,
      ).toEqual(recentPeoplePromise);
    });
  });

  it('should not pre fetch if no cloud id is supplied', async () => {
    const cloudId = null;

    const child = (
      <GlobalSearchPreFetchContext.Consumer>
        {() => {
          return <div />;
        }}
      </GlobalSearchPreFetchContext.Consumer>
    );

    render('confluence', child, cloudId);

    expect(getConfluencePrefetchedData).not.toHaveBeenCalled();
  });
});
