const spawndamnit = require('spawndamnit');

function spawn(...args) {
  console.log({ args });
  const child = spawndamnit(...args);
  child.on('stdout', log());
  child.on('stderr', log('error'));
  return child;
}

const log = (type = 'log') => data =>
  // eslint-disable-next-line
  console[type](data.toString());

module.exports = {
  spawn,
};
