// @flow
const git = require('./git');

async function getChangedFilesSinceMaster() {
  const masterRef = await git.getMasterRef();
  return git.getChangedFilesSince(masterRef, true);
}

module.exports = {
  getChangedFilesSinceMaster,
};
