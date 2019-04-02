import * as React from 'react';
import {
  getConfluencePrefetchedData,
  GlobalSearchPrefetchedResults,
} from '../api/prefetchResults';

interface PrefetchContext {
  prefetchedResults?: GlobalSearchPrefetchedResults;
}

export const GlobalSearchPreFetchContext = React.createContext<PrefetchContext>(
  {
    prefetchedResults: undefined,
  },
);

interface Props {
  context: 'jira' | 'confluence';
  cloudId: string;
  searchSessionId: string;
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
    searchSessionId: string,
  ): GlobalSearchPrefetchedResults | undefined => {
    const { context, baseUrl } = this.props;
    switch (context) {
      case 'confluence':
        return getConfluencePrefetchedData(cloudId, searchSessionId, baseUrl);
      case 'jira':
        // To be implemented in https://product-fabric.atlassian.net/browse/QS-623
        return undefined;
    }
  };

  async componentDidMount() {
    const { cloudId, searchSessionId } = this.props;
    const { prefetchedResults: prefetchedResults } = this.state;
    if (!prefetchedResults) {
      const newPrefetchedResults = await this.getPrefetchedResults(
        cloudId,
        searchSessionId,
      );
      this.setState({
        prefetchedResults: newPrefetchedResults,
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
