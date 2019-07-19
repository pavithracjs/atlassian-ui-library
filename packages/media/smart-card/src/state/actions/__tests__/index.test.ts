const mockEvents = {
  resolvedEvent: jest.fn(),
  unresolvedEvent: jest.fn(),
  connectSucceededEvent: jest.fn(),
  connectFailedEvent: jest.fn(),
  trackAppAccountConnected: jest.fn(),
  uiAuthEvent: jest.fn(),
  uiAuthAlternateAccountEvent: jest.fn(),
  uiCardClickedEvent: jest.fn(),
  uiClosedAuthEvent: jest.fn(),
  screenAuthPopupEvent: jest.fn(),
  fireSmartLinkEvent: jest.fn(),
};
const mockAuthFlow = jest.fn();

jest.doMock('../../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
}));

const mockContext = {
  config: { maxAge: 100, maxLoading: 100 },
  connections: {
    client: {
      fetchData: jest.fn(),
    },
  },
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  },
};
jest.doMock('../../context', () => ({
  useSmartLinkContext: jest.fn(() => mockContext),
}));

import { useSmartCardActions } from '..';
import { mocks } from '../../../utils/mocks';
import { FetchError } from '../../../client';

describe('Smart Card: Actions', () => {
  let url: string;
  let dispatchAnalytics: jest.Mock;

  beforeEach(() => {
    url = 'https://some/url';
    dispatchAnalytics = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('dispatches pending action if card not in store', async () => {
      const { connections } = mockContext;
      const { client } = connections;
      const mockFetchData = async () => mocks.success;
      client.fetchData.mockImplementationOnce(mockFetchData);

      const actions = useSmartCardActions(url, dispatchAnalytics);
      actions.register();

      await mockFetchData();

      expect(client.fetchData).toBeCalled();
      expect(client.fetchData).toBeCalledWith(url);
      expect(dispatchAnalytics).toBeCalled();
      expect(mockEvents.resolvedEvent).toBeCalled();
    });
  });

  describe('resolve()', () => {
    it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
      const { connections } = mockContext;
      const { client } = connections;
      const mockFetchData = () =>
        Promise.reject(new FetchError('fatal', '0xBAADF00D'));
      client.fetchData.mockImplementationOnce(mockFetchData);
      mockContext.store.getState.mockImplementationOnce(() => ({
        [url]: {
          status: 'pending',
          lastUpdatedAt: 0,
          details: undefined,
        },
      }));

      const actions = useSmartCardActions(url, dispatchAnalytics);
      const promise = actions.register();
      await expect(promise).rejects.toThrow(Error);
      await expect(promise).rejects.toHaveProperty('kind', 'fatal');

      expect(client.fetchData).toHaveBeenCalledWith(url);
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: 'pending',
        url: 'https://some/url',
      });
    });

    it('falls back to previous data if the URL failed to be resolved', async () => {
      const { connections } = mockContext;
      const { client } = connections;
      const mockFetchData = () =>
        Promise.reject(new FetchError('fatal', '0xBAADF00D'));
      client.fetchData.mockImplementationOnce(mockFetchData);
      mockContext.store.getState.mockImplementation(() => ({
        [url]: {
          status: 'resolved',
          lastUpdatedAt: 0,
          details: mocks.success,
        },
      }));

      const actions = useSmartCardActions(url, dispatchAnalytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(client.fetchData).toHaveBeenCalledWith(url);
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: mocks.success,
        type: 'resolved',
        url: 'https://some/url',
      });
    });

    it('resolves to authentication error data if resolving failed for auth reasons', async () => {
      const { connections } = mockContext;
      const { client } = connections;
      const mockFetchData = () =>
        Promise.reject(new FetchError('auth', 'YOU SHALL NOT PASS'));
      client.fetchData.mockImplementationOnce(mockFetchData);
      mockContext.store.getState.mockImplementationOnce(() => ({
        [url]: {
          status: 'pending',
          lastUpdatedAt: 0,
          details: undefined,
        },
      }));

      const actions = useSmartCardActions(url, dispatchAnalytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(client.fetchData).toHaveBeenCalledWith(url);
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: {
          meta: {
            access: 'unauthorized',
            auth: [],
            definitionId: 'provider-not-found',
            visibility: 'restricted',
          },
          data: {},
        },
        type: 'resolved',
        url: 'https://some/url',
      });
    });
  });
});
