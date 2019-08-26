import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';

import { complexTree } from '../../../../../mockdata/complexTree';
import Tree from '../..';
import { RenderItemParams } from '../../../TreeItem/TreeItem-types';

jest.mock('exenv', () => ({
  get canUseDOM() {
    return false;
  },
}));

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

const renderItem = ({ provided }: RenderItemParams) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
  >
    Draggable
  </div>
);

const App = () => (
  <Tree
    tree={complexTree}
    renderItem={renderItem}
    isDragEnabled
    isNestingEnabled
  />
);

//TODO: https://ecosystem.atlassian.net/browse/AK-6450// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('should ssr then hydrate tree correctly', () => {
  const canUseDom = jest.spyOn(exenv, 'canUseDOM', 'get');

  // server-side
  canUseDom.mockReturnValue(false);
  const serverHTML = ReactDOMServer.renderToString(<App />);

  // client-side
  canUseDom.mockReturnValue(true);
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;

  ReactDOM.hydrate(<App />, elem);

  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();
});
