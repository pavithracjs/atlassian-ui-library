import { ContextFactory } from '../..';
import {
  asMock,
  getDefaultMediaClientConfig,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import * as MediaClientModule from '@atlaskit/media-client';

describe('ContextFactory', () => {
  beforeEach(() => {
    jest.spyOn(MediaClientModule, 'MediaClient');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return new mediaClient on ContextFactory.create call', () => {
    const mediaClientConfig = getDefaultMediaClientConfig();
    const mediaClient = fakeMediaClient();

    asMock(MediaClientModule.MediaClient).mockReturnValue(mediaClient);
    const context = ContextFactory.create(mediaClientConfig);
    expect(context).toBe(mediaClient);
  });
});
