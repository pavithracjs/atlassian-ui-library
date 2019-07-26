/**
 * This script is used during branch deployss to update all the package.json's of changed packages
 * so that if they have any dependencies on other changed packages, they also point to the branch
 * deployed version.
 */

const bolt = require('bolt');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

const { CHANGED_PACKAGES, BITBUCKET_COMMIT } = process.env;
if (!CHANGED_PACKAGES) {
  console.error(
    'Expected to find list of changed packages in $CHANGED_PACKAGES',
  );
  console.error('Exiting');
  process.exit(1);
}
if (!BITBUCKET_COMMIT) {
  console.error('Expected to find current commit in $BITBUCKET_COMMIT');
  console.error('Exiting');
  process.exit(1);
}

const changedPackages = JSON.parse(CHANGED_PACKAGES);
const commit = BITBUCKET_COMMIT.substr(0, 12);

const getExpectedUrl = (pkgName, pkgVersion, commit) => {
  const shortPkgName = pkgName.replace('@atlaskit/', '');
  `http://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts/${commit}/dists/${shortPkgName}-${pkgVersion}.tgz`;
};

bolt.getWorkspaces().then(workspaces => {
  const changedPackagesInfo = workspaces.filter(ws =>
    changedPackages.includes(path.relative(cwd, ws.dir)),
  );

  changedPackagesInfo.forEach(pkg => {
    const packageJsonPath = path.join(pkg.dir, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath));
    let pkgJsonDirty = false;
    Object.entries(pkgJson.dependencies).forEach(([depName, depVersion]) => {
      let cpInfo = changedPackagesInfo.find(
        changedPkg => changedPkg.name === depName,
      );

      if (cpInfo) {
        const depVersion = cpInfo.config.version;
        const expectedUrl = getExpectedUrl(depName, depVersion, commit);
        pkgJson.dependencies[depName] = expectedUrl;
        console.log(
          `Updating dep of ${pkgJson.name}: ${depName} - ${expectedUrl}`,
        );
        pkgJsonDirty = true;
      }
    });

    if (pkgJsonDirty) {
      const pkgJsonStr = JSON.stringify(pkgJson, null, 2);
      console.log(`Updating package.json at ${packageJsonPath}`);
      fs.writeFileSync(packageJsonPath, pkgJsonStr);
    }
  });
});
