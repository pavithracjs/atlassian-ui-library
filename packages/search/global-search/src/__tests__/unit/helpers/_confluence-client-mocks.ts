import fetchMock from 'fetch-mock';
import {
  ConfluenceContentType,
  QuickNavResponse,
  QuickNavResult,
  RecentPage,
  RecentSpace,
} from '../../../api/ConfluenceClient';

export const DUMMY_CONFLUENCE_HOST = 'http://localhost';
export const DUMMY_CLOUD_ID = '123';
export const PAGE_CLASSNAME = 'content-type-page';
export const BLOG_CLASSNAME = 'content-type-blogpost';
export const SPACE_CLASSNAME = 'content-type-space';
export const PEOPLE_CLASSNAME = 'content-type-userinfo';

export function buildMockPage(type: ConfluenceContentType): RecentPage {
  return {
    available: true,
    contentType: type,
    id: '123',
    lastSeen: 123,
    space: 'Search & Smarts',
    spaceKey: 'abc',
    title: 'Page title',
    type: 'page',
    url: '/content/123',
    iconClass: 'iconClass',
  };
}

export const MOCK_SPACE = {
  id: '123',
  key: 'S&S',
  icon: 'icon',
  name: 'Search & Smarts',
};

export const MOCK_QUICKNAV_RESULT_BASE = {
  href: '/href',
  name: 'name',
  id: '123',
  icon: 'icon',
};

export const mockQuickNavResult = (className: string) => ({
  className: className,
  ...MOCK_QUICKNAV_RESULT_BASE,
});

export function mockRecentlyViewedPages(pages: RecentPage[]) {
  fetchMock.get('begin:http://localhost/rest/recentlyviewed/1.0/recent', pages);
}

export function mockRecentlyViewedSpaces(spaces: RecentSpace[]) {
  fetchMock.get(
    'begin:http://localhost/rest/recentlyviewed/1.0/recent/spaces',
    spaces,
  );
}

export function mockQuickNavSearch(results: QuickNavResult[][]) {
  fetchMock.get('begin:http://localhost/rest/quicknav/1', {
    contentNameMatches: results,
  } as QuickNavResponse);
}
