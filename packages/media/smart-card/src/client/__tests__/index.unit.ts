let mockRequest = jest.fn();
jest.mock('../api', () => ({
  request: (...args: any) => mockRequest(args[0], args[1], args[2]),
}));

import SmartCardClient from '..';

describe('Smart Card: Client', () => {
  beforeEach(() => {
    mockRequest = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully sets up client with passed environment', async () => {
    const client = new SmartCardClient('stg');
    const resourceUrl = 'https://i.love.cheese';
    await client.fetchData('https://i.love.cheese');
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve/),
      {
        resourceUrl,
      },
    );
  });
});
