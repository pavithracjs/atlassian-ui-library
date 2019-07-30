import { utils } from '@atlaskit/util-service-support';

import {
  NavAutocompleteClient,
  NavAutocompleteClientImpl,
} from '../../../api/NavAutocompleteClient';

const url = 'https://pug.jira-dev.com/';
const cloudId = 'cloudId';

describe('NavAutoCompleteClient', () => {
  let requestSpy: jest.SpyInstance;
  let navAutoCompleteClient: NavAutocompleteClient;

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService');
    requestSpy.mockReturnValue(Promise.resolve(undefined));
    navAutoCompleteClient = new NavAutocompleteClientImpl(url, cloudId);
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  it('requests navautocomplete suggestion with query', () => {
    navAutoCompleteClient.getNavAutocompleteSuggestions('auto');

    expect(requestSpy).toHaveBeenCalledTimes(1);

    const serviceConfigParam = requestSpy.mock.calls[0][0];
    expect(serviceConfigParam).toHaveProperty('url', url);
  });

  it('should return the data from autocomplete API', async () => {
    const expectedResult = ['autocomplete', 'automock', 'automation'];
    requestSpy.mockReturnValue(Promise.resolve(expectedResult));
  });
});
