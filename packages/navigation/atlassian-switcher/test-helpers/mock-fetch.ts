import ORIGINAL_MOCK_DATA from '../examples/helpers/mock-data';

const urlToDataMap: { [s: string]: any } = {
  '/gateway/api/activity/api/client/recent/containers?cloudId=some-cloud-id':
    ORIGINAL_MOCK_DATA.RECENT_CONTAINERS_DATA,
  '/rest/menu/latest/appswitcher': ORIGINAL_MOCK_DATA.CUSTOM_LINKS_DATA,
  '/gateway/api/xflow/some-cloud-id/license-information':
    ORIGINAL_MOCK_DATA.LICENSE_INFORMATION_DATA,
  '/gateway/api/permissions/permitted': ORIGINAL_MOCK_DATA.USER_PERMISSION_DATA,
  '/gateway/api/site/some-cloud-id/setting/xflow':
    ORIGINAL_MOCK_DATA.XFLOW_SETTINGS,
};

declare var global: any;

global.fetch = (url: string) => {
  const data: Object = urlToDataMap[url];
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });
};
