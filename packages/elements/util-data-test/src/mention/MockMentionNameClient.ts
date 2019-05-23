import {
  MentionNameClient,
  MentionNameDetails,
  MentionNameResult,
} from '@atlaskit/mention/resource';
import debug from '../logger';

export class MockMentionNameClient implements MentionNameClient {
  constructor() {}

  getLookupLimit() {
    return 10;
  }

  lookupMentionNames(ids: string[]): Promise<MentionNameDetails[]> {
    debug('lookupMentionNames', ids);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          ids.map<MentionNameDetails>(id => ({
            id,
            name: `Hydrated ${id} name`,
            result: MentionNameResult.OK,
          })),
        );
      }, 1500);
    });
  }
}
