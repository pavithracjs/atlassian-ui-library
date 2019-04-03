import * as React from 'react';
import { objectData, personData, containerData } from './mockData';
import {
  QuickSearch,
  ResultItemGroup,
  ContainerResult,
  ContainerResultProps,
  PersonResult,
  PersonResultProps,
  ObjectResult,
  ObjectResultProps,
} from '../../src';

type DataShape = {
  title: string;
  items: (ContainerResultProps | PersonResultProps | ObjectResultProps)[];
};

const data: DataShape[] = [
  {
    title: 'Objects',
    items: objectData(5),
  },
  {
    title: 'People',
    items: personData(5),
  },
  {
    title: 'Containers',
    items: containerData(5),
  },
];

const availableResultTypes: { [key: string]: React.ComponentClass<any> } = {
  person: PersonResult,
  object: ObjectResult,
  container: ContainerResult,
};

const mapResultsDataToComponents = (resultData: DataShape[]) => {
  if (!resultData || !resultData.length) {
    return 'Nothin` to see here';
  }

  return resultData.map((group: DataShape) => (
    <ResultItemGroup title={group.title} key={group.title}>
      {group.items.map(props => {
        const Result: React.ComponentClass = availableResultTypes[props.type!];
        return Result ? <Result key={props.resultId} {...props} /> : null;
      })}
    </ResultItemGroup>
  ));
};

function contains(string: string, query: string) {
  return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function searchData(query: string): DataShape[] {
  const results = data
    .map(({ title, items }) => {
      const filteredItems = items.filter(item =>
        contains(item.name as string, query),
      );
      return { title, items: filteredItems };
    })
    .filter(group => group.items.length);
  return results;
}

// a little fake store for holding the query after a component unmounts
type Store = {
  query?: string;
};
const store: Store = {};

type Props = {
  fakeNetworkLatency?: number;
};

type State = {
  query: string;
  results: DataShape[];
  isLoading: boolean;
};

export default class BasicQuickSearch extends React.Component<Props, State> {
  static defaultProps = {
    fakeNetworkLatency: 0,
  };

  state = {
    query: store.query || '',
    results: searchData(''),
    isLoading: false,
  };

  searchTimeoutId: any;

  setQuery(query: string) {
    store.query = query;
    this.setState({
      query,
    });
  }

  search = (query: string) => {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    this.setState({
      isLoading: true,
    });
    this.setQuery(query);
    const results = searchData(query);
    this.searchTimeoutId = window.setTimeout(() => {
      this.setState({
        results,
        isLoading: false,
      });
    }, this.props.fakeNetworkLatency);
  };

  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={event => {
          this.search(event.currentTarget.value);
        }}
        onSearchSubmit={() => console.log('onSearchSubmit', this.state.query)}
        value={this.state.query}
      >
        <div style={{ paddingLeft: '10px' }}>
          {mapResultsDataToComponents(this.state.results)}
        </div>
      </QuickSearch>
    );
  }
}
