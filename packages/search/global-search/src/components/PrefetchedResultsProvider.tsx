import * as React from 'react';
import {
  getConfluencePrefetchedData,
  GlobalSearchPrefetchedResults,
} from '../api/prefetchResults';
import { QuickSearchContext } from '../api/types';

interface PrefetchContext {
  prefetchedResults?: GlobalSearchPrefetchedResults;
}

export const GlobalSearchPreFetchContext = React.createContext<PrefetchContext>(
  {
    prefetchedResults: undefined,
  },
);

interface Props {
  context: QuickSearchContext;
  cloudId: string;
  children: JSX.Element;
  baseUrl?: string;
}

interface State {
  prefetchedResults?: GlobalSearchPrefetchedResults;
}

export default class PrefetchedResultsProvider extends React.Component<
  Props,
  State
> {
  state = {
    prefetchedResults: undefined,
  };

  getPrefetchedResults = (
    cloudId: string,
  ): GlobalSearchPrefetchedResults | undefined => {
    const { context, baseUrl } = this.props;

    if (!cloudId) {
      return;
    }

    switch (context) {
      case 'confluence':
        return getConfluencePrefetchedData(cloudId, baseUrl);
      default:
        // To be implemented in https://product-fabric.atlassian.net/browse/QS-623
        throw new Error(
          `Prefetching is not supported for context: ${context} - did you set the PrefetchResultProvider context incorrectly?`,
        );
    }
  };

  componentDidMount() {
    const { cloudId } = this.props;
    const { prefetchedResults: prefetchedResults } = this.state;
    if (!prefetchedResults) {
      this.setState({
        prefetchedResults: this.getPrefetchedResults(cloudId),
      });
    }
  }

  render() {
    const { children } = this.props;
    const { prefetchedResults } = this.state;
    return (
      <GlobalSearchPreFetchContext.Provider value={{ prefetchedResults }}>
        {children}
      </GlobalSearchPreFetchContext.Provider>
    );
  }
}
