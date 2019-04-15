import fetchMock from 'fetch-mock';
import { GraphqlResponse, SearchResult } from '../../../api/PeopleSearchClient';

export function searchApiWillReturn(state: SearchResult[] | GraphqlResponse) {
  const response = Array.isArray(state)
    ? { data: { UserSearch: state } }
    : state;

  const opts = {
    name: 'people',
  };
  fetchMock.post('localhost/graphql', response, opts);
}

export function recentPeopleApiWillReturn(
  state: SearchResult[] | GraphqlResponse,
) {
  const response = Array.isArray(state)
    ? { data: { Collaborators: state } }
    : state;

  const opts = {
    name: 'people',
  };
  fetchMock.post('localhost/graphql', response, opts);
}
