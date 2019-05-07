import { utils } from '@atlaskit/util-service-support';

import {
  AutoCompleteClient,
  AutoCompleteClientImpl,
} from '../../../api/AutoCompleteClient';

const url = 'https://pug.jira-dev.com/';
const cloudId = 'cloudId';

describe('AutoCompleteClient', () => {
  let requestSpy: jest.SpyInstance;
  let autoCompleteClient: AutoCompleteClient;

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService');
    autoCompleteClient = new AutoCompleteClientImpl(url, cloudId);
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  it('requests autocomplete suggestion with query', () => {
    autoCompleteClient.getAutocomplete('auto');

    expect(requestSpy).toHaveBeenCalledTimes(1);

    const serviceConfigParam = requestSpy.mock.calls[0][0];
    expect(serviceConfigParam).toHaveProperty('url', url);
    const serviceOptions = requestSpy.mock.calls[0][1];
    const expectedQueryParams = {
      cloudId,
      autofix: 1,
      query: 'auto',
    };
    expect(serviceOptions).toHaveProperty('queryParams', expectedQueryParams);
  });

  it('should return the data from autocomplete API', async () => {
    const expectedResult = ['autocomplete', 'automock', 'automation'];
    requestSpy.mockReturnValue(Promise.resolve(expectedResult));

    const result = await autoCompleteClient.getAutocomplete('auto');

    expect(result).toEqual(expectedResult);
  });
});
