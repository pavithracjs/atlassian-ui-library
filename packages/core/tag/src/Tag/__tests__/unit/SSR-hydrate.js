// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';
import Tag from '../..';
import waitForExpect from 'wait-for-expect';

beforeEach(() => {
  jest.setTimeout(10000);
});

jest.mock('exenv', () => ({
  get canUseDOM() {
    return false;
  },
}));

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

const App = () => <Tag text="Base Tag" />;

test('should ssr then hydrate tag correctly', async () => {
  const canUseDom = jest.spyOn(exenv, 'canUseDOM', 'get');
  // server-side
  canUseDom.mockReturnValue(false);
  const serverHTML = ReactDOMServer.renderToString(<App />);
  // client-side
  canUseDom.mockReturnValue(true);
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  await waitForExpect(() => {
    ReactDOM.hydrate(<App />, elem);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
