const bolt = require('bolt');
const path = require('path');
const changesets = require('../utils/changesets');
const git = require('../utils/git');

/**
 * NOTE: This prints the list of packages with corresponding changesets.
 * It will print them all out as a space serperated list of relative paths.
 * i.e: $ node build/ci-scripts/get.changed.packages.from.changesets.js
 *        "packages/core/avatar" "packages/core/badge"
 * */
(async () => {
  let cwd = process.cwd();
  let branch = await git.getBranchName();
  const project = await bolt.getProject();
  const projectDir = project.dir;
  const allPackages = await bolt.getWorkspaces({ cwd });

  let allChangesets = await changesets.getNewFSChangesets(cwd);

  const changeset = allChangesets
    .reduce((acc, current) => {
      return acc.concat(
        ...(current.releases || []),
        ...(current.dependents || []),
      );
    }, [])
    .map(c => {
      const f = allPackages.find(p => p.name === c.name);
      return path.relative(projectDir, f.dir);
    });

  // Ensure we have unique paths.
  console.log(Array.from(new Set(changeset)).join(' '));
})();
