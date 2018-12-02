const spawndamnit = require('spawndamnit');

function spawn(...args) {
  return spawndamnit(...args);
}

const log = (type = 'log') => data =>
  // eslint-disable-next-line
  console[type](data.toString());

module.exports = {
  spawn,
};
