const fs = require('fs');
const gzipSize = require('gzip-size');

function fStats(filePath) {
  return {
    size: fs.statSync(filePath).size,
    gzipSize: gzipSize.sync(fs.readFileSync(filePath)),
  };
}

function fExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

function fDelete(dir) {
  if (fExists(dir)) {
    try {
      exec(`rm -rf ${dir}`);
    } catch (e) {}
  }
}

module.exports = { fStats, fExists, fDelete };
