// WARNING: This is currently a workaround until changeset is available through exposed functions.
// It's not advised to depend on this, as it's not a complete implementation. (Dependent packages will not be generated).
// Follow changeset GitHub ticket here: https://github.com/atlassian/changesets/issues/122
const humanId = require('human-id');
const spawn = require('projector-spawn');
const fse = require('fs-extra');
const path = require('path');

const createChangeset = async (packages, message) => {
  const changeset = {
    releases: packages,
    dependents: [],
  };
  const id = humanId({
    separator: '-',
    capitalize: false,
  });

  // Create changeset directory
  await fse.mkdirp(path.join(process.cwd(), '.changeset', id)).catch(err => {
    return abortChangeset(id, err);
  });

  // Create changeset.json
  fse
    .writeFile(
      path.join(process.cwd(), '.changeset', id, 'changes.json'),
      JSON.stringify(changeset, null, 2),
    )
    .catch(err => {
      return abortChangeset(id, err);
    });

  // Create changeset.md
  fse
    .writeFile(
      path.join(process.cwd(), '.changeset', id, 'changes.md'),
      message,
    )
    .catch(err => {
      return abortChangeset(id, err);
    });

  return true;
};

const abortChangeset = async (id, message) => {
  await spawn('rm', ['-rf', path.join(process.cwd(), '.changeset', id)]);
  console.error(`Failed to create changeset ${id}: ${message}`);
  return false;
};

module.exports = {
  createChangeset,
};
