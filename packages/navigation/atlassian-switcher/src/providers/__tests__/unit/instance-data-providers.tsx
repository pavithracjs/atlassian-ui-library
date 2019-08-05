import { RecentContainersProvider } from '../../instance-data-providers';

declare var global: any;
import * as React from 'react';
import { mount } from 'enzyme';

describe('instance-data-providers', () => {
  let fetchMock: any;
  beforeEach(() => {
    fetchMock = jest.fn();
    fetchMock.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('disables recent containers', async () => {
    const children = jest.fn();
    mount(
      <RecentContainersProvider
        cloudId="cloudid"
        disableRecentContainers={true}
      >
        {children}
      </RecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: { data: [] },
      status: 'complete',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('enables recent containers', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <RecentContainersProvider
        cloudId="cloudid"
        disableRecentContainers={false}
      >
        {children}
      </RecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: null,
      status: 'loading',
    });
    expect(fetchMock).toHaveBeenCalled();
  });
});
