const path = require('path');
const bolt = require('bolt');

const getNpmDistPath = pkgName => path.join(process.cwd(), 'dists', pkgName);

async function getAllPublicPackages(cwd) {
  const allWorkspaces = await bolt.getWorkspaces({
    cwd,
  });

  return allWorkspaces
    .map(({ dir, config: { name, private, version } }) => ({
      dir,
      name,
      version,
      private,
    }))
    .filter(p => !p.private);
}

module.exports = {
  getAllPublicPackages,
  getNpmDistPath,
};
