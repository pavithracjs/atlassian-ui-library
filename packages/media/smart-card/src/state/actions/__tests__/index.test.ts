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
      const mockResponse = async () => mocks.success;
      client.fetchData.mockImplementationOnce(mockResponse);

      const actions = useSmartCardActions(url, dispatchAnalytics);
      actions.register();

      await mockResponse;

      expect(client.fetchData).toBeCalled();
      expect(client.fetchData).toBeCalledWith(url);
      expect(dispatchAnalytics).toBeCalled();
      expect(mockEvents.resolvedEvent).toBeCalled();
    });
  });
});
