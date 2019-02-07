require('@babel/register');
require('@babel/polyfill');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const filePath = process.argv[2];
const Example = require(filePath).default; // eslint-disable-line import/no-dynamic-require

let serverHTML;
try {
  serverHTML = ReactDOMServer.renderToString(React.createElement(Example));
} catch (error) {
  process.send({ error: error.toString() });
}
process.send({ html: serverHTML });
