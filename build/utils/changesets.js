const path = require('path');
const bolt = require('bolt');
const fse = require('fs-extra');
const git = require('./git');

async function getAllFSChangesets(cwd) {
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const changesetBase = path.join(projectRoot, '.changeset');
  if (!fse.existsSync(changesetBase)) {
    throw new Error('There is no .changeset directory in this project');
  }

  const dirs = fse.readdirSync(changesetBase);
  // this needs to support just not dealing with dirs that aren't set up properly
  return dirs
    .filter(file => fse.lstatSync(path.join(changesetBase, file)).isDirectory())
    .map(changesetDir => {
      const jsonPath = path.join(changesetBase, changesetDir, 'changes.json');
      // $ExpectError
      return require(jsonPath);
    });
}

async function getNewFSChangesets(cwd) {
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const paths = await git.getChangedChangesetFilesSinceMaster();

  // $ExpectError
  return paths.map(filePath => require(path.join(projectRoot, filePath)));
}

module.exports = {
  getAllFSChangesets,
  getNewFSChangesets,
};
