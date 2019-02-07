import { fork } from 'child_process';
import path from 'path';

const ssr = async example =>
  new Promise((resolve, reject) => {
    const forked = fork(path.join(__dirname, 'ssr.js'), [example]);
    forked.on('message', msg =>
      msg.error ? reject(`${msg.error}`) : resolve(msg.html),
    );
  });

module.exports = {
  ssr,
};
