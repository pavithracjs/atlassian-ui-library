import fetchMock from 'fetch-mock';

export function mockNotificationsEndpoint(
  fabricNotificationLogUrl: string,
  count: number,
) {
  fetchMock.get(
    `begin:${fabricNotificationLogUrl}`,
    Promise.resolve({ count }),
  );
}
