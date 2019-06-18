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

jest.mock('react-lazily-render-scroll-parent', () => (data: any) =>
  data.content,
);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
}));

import * as React from 'react';
import CardClient from '../../client';
import { Card } from '../Card';
import { Provider } from '../..';
import { fakeFactory, mocks } from '../../utils/mocks';
import {
  render,
  waitForElement,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import {
  MESSAGE_WINDOW_CLOSED,
  KEY_SENSITIVE_DATA,
  KEY_WINDOW_CLOSED,
} from '../../utils/analytics';

describe('smart-card: analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'some.url';
    mockWindowOpen = jest.fn();
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('unauthorized', () => {
    it('should fire connectSucceeded event when auth succeeds', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByText, container } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(() =>
        getByText(/Connect your account to preview links/),
      );
      const unauthorizedLinkButton = container.querySelector('button');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(async () => ({}));
      fireEvent.click(unauthorizedLinkButton!);

      const resolvedView = await waitForElement(() => getByText('cheese'));
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire connectFailed event when auth fails', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByText, container } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(() =>
        getByText(/Connect your account to preview links/),
      );
      const unauthorizedLinkButton = container.querySelector('button');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(() => Promise.reject(new Error()));
      fireEvent.click(unauthorizedLinkButton!);

      const unresolvedView = await waitForElement(() => getByText('cheese'));
      expect(unresolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        KEY_SENSITIVE_DATA,
      );
    });

    it('should fire connectFailed when auth dialog was closed', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByText, container } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(() =>
        getByText(/Connect your account to preview links/),
      );
      const unauthorizedLinkButton = container.querySelector('button');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(() =>
        Promise.reject({ message: MESSAGE_WINDOW_CLOSED }),
      );
      fireEvent.click(unauthorizedLinkButton!);

      const resolvedView = await waitForElement(() => getByText('cheese'));
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiClosedAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        KEY_WINDOW_CLOSED,
      );
    });
  });

  describe('forbidden', () => {
    it('should fire analytics events when attempting to connect with an alternate account succeeds', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.forbidden);
      const { getByText, container } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const forbiddenLink = await waitForElement(() =>
        getByText(/You don't have permissions/),
      );
      const forbiddenLinkButton = container.querySelector('button');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(async () => ({}));
      fireEvent.click(forbiddenLinkButton!);

      const resolvedView = await waitForElement(() => getByText('cheese'));
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire analytics events when attempting to connect with an alternate account fails', async () => {
      mockFetch.mockImplementationOnce(async () => mocks.forbidden);
      const { getByText, container } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const forbiddenLink = await waitForElement(() =>
        getByText(/You don't have permissions/),
      );
      const forbiddenLinkButton = container.querySelector('button');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(() => Promise.reject(new Error()));
      fireEvent.click(forbiddenLinkButton!);

      const unresolvedView = await waitForElement(() => getByText('cheese'));
      expect(unresolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        KEY_SENSITIVE_DATA,
      );
    });
  });

  describe('resolved', () => {
    it('should fire the resolved analytics event when the url was resolved', async () => {
      const { getByText } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(() => getByText('cheese'));
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.resolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.resolvedEvent).toHaveBeenCalledWith('d1');
    });

    it('should fire clicked analytics event when a resolved URL is clicked', async () => {
      const { getByText, getByRole } = render(
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(() => getByText('cheese'));
      const resolvedCard = getByRole('button');
      expect(resolvedView).toBeTruthy();
      expect(resolvedCard).toBeTruthy();
      expect(mockEvents.resolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.resolvedEvent).toHaveBeenCalledWith('d1');

      fireEvent.click(resolvedCard);
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiCardClickedEvent).toHaveBeenCalledTimes(1);
    });
  });
});
