import { ActivityItem, ActivityResource } from '@atlaskit/activity';

export class MockActivityResource extends ActivityResource {
  private items: Array<ActivityItem> = [];
  constructor(items: Array<ActivityItem>) {
    super('', '');
    this.items = items;
  }

  getRecentItems(): Promise<ActivityItem[]> {
    return Promise.resolve(this.items);
  }
}

export function activityProviderFactory(items: Array<ActivityItem>) {
  return Promise.resolve(new MockActivityResource(items));
}
