const util = require('util');
const vm = require('vm');
const fs = require('fs');
import { fork } from 'child_process';
import path from 'path';

const ssr = async example =>
  new Promise((resolve, reject) => {
    const script = new vm.Script(
      fs.readFileSync(path.join(__dirname, 'ssr.js')),
    );
    const context = vm.createContext({
      filePath: example,
      require: require,
      jest: jest,
      __dirname: __dirname,
    });
    let html;
    try {
      html = script.runInNewContext(context);
    } catch (e) {
      reject(e);
    }
    if (html) {
      resolve(html);
    }
  });

module.exports = {
  ssr,
};
