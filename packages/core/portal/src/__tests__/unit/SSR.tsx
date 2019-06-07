/**
 * @jest-environment node
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Portal from '../..';

test.skip(`Portal renders without exception in node environment`, () => {
  expect(() =>
    ReactDOMServer.renderToString(
      <Portal>
        <h1>:wave:</h1>
      </Portal>,
    ),
  ).not.toThrowError();
});
