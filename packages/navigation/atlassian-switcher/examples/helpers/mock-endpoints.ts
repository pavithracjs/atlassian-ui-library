import fetchMock from 'fetch-mock';
import ORIGINAL_MOCK_DATA, { MockData } from './mock-data';

interface DataTransformer {
  (originalMockData: MockData): MockData;
}

interface LoadTimes {
  containers?: number;
  xflow?: number;
  licenseInformation?: number;
  permitted?: number;
  appswitcher?: number;
  availableProducts?: number;
}

export const REQUEST_SLOW = {
  containers: 2000,
  xflow: 1200,
  licenseInformation: 1000,
  permitted: 500,
  appswitcher: 1500,
};

export const REQUEST_MEDIUM = {
  containers: 1000,
  xflow: 600,
  licenseInformation: 400,
  permitted: 250,
  appswitcher: 750,
};

export const REQUEST_FAST = {
  containers: 500,
  xflow: 300,
  licenseInformation: 200,
  permitted: 125,
  appswitcher: 375,
};

export const mockEndpoints = (
  product: string,
  transformer?: DataTransformer,
  loadTimes: LoadTimes = {},
) => {
  const mockData = transformer
    ? transformer(ORIGINAL_MOCK_DATA)
    : ORIGINAL_MOCK_DATA;

  const {
    AVAILABLE_PRODUCTS_DATA,
    RECENT_CONTAINERS_DATA,
    CUSTOM_LINKS_DATA,
    LICENSE_INFORMATION_DATA,
    USER_PERMISSION_DATA,
    XFLOW_SETTINGS,
  } = mockData;
  fetchMock.get(
    '/gateway/api/worklens/api/available-products',
    () =>
      new Promise(res =>
        setTimeout(
          () => res(AVAILABLE_PRODUCTS_DATA),
          loadTimes && loadTimes.availableProducts,
        ),
      ),
    { overwriteRoutes: true },
  );
  fetchMock.get(
    '/gateway/api/activity/api/client/recent/containers?cloudId=some-cloud-id',
    () =>
      new Promise(res =>
        setTimeout(
          () => res(RECENT_CONTAINERS_DATA),
          loadTimes && loadTimes.containers,
        ),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
  fetchMock.get(
    `${product === 'confluence' ? '/wiki' : ''}/rest/menu/latest/appswitcher`,
    () =>
      new Promise(res =>
        setTimeout(
          () => res(CUSTOM_LINKS_DATA),
          loadTimes && loadTimes.appswitcher,
        ),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
  fetchMock.get(
    '/gateway/api/xflow/some-cloud-id/license-information',
    () =>
      new Promise(res =>
        setTimeout(
          () => res(LICENSE_INFORMATION_DATA),
          loadTimes && loadTimes.licenseInformation,
        ),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
  fetchMock.post(
    '/gateway/api/permissions/permitted',
    (_: string, options: { body: string }) =>
      new Promise(res =>
        setTimeout(
          () =>
            res(
              USER_PERMISSION_DATA[
                JSON.parse(options.body).permissionId as
                  | 'manage'
                  | 'add-products'
              ],
            ),
          loadTimes && loadTimes.permitted,
        ),
      ),
    { method: 'POST', overwriteRoutes: true },
  );
  fetchMock.get(
    '/gateway/api/site/some-cloud-id/setting/xflow',
    () =>
      new Promise(res =>
        setTimeout(() => res(XFLOW_SETTINGS), loadTimes && loadTimes.xflow),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
};
