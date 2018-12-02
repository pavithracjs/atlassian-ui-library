//@flow
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

async function exists(base /*: string */, files /*: Array<string> */ = []) {
  return await Promise.all(
    files.map(async file => {
      const absolutePath = path.join(base, file);
      try {
        await promisify(fs.access)(absolutePath);
        return Promise.resolve(true);
      } catch (e) {
        // console.log(e)
        return Promise.resolve(false);
      }
    }),
  );
}

async function allExists(base /*: string */, files /*: Array<string> */ = []) {
  return (await exists(base, files)).every(Boolean);
}

async function pathsExist(base /*: string */, files /*: Array<string> */ = []) {
  const results = await exists(base, files);
  return results.reduce((acc, current, idx) => {
    acc[files[idx]] = current;
    return acc;
  }, {});
}

module.exports = {
  exists,
  allExists,
  pathsExist,
};
