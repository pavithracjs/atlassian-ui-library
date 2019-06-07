// @flow
const path = require('path');
const fs = require('fs');
const bolt = require('bolt');
const fsExtra = require('fs-extra');
const rimraf = require('rimraf');

// copy source folder to destination
// Find the folder es2015
// copy the folder + rename to cjs
(async () => {
  const packages = await bolt.getWorkspaces();
  const pkgContents = packages
    .filter(
      pkg => pkg.dir.includes('/packages/') && !pkg.config.atlaskit.internal,
    )
    .map(pkg => {
      return {
        name: pkg.name,
        pkgDirPath: pkg.dir,
      };
    });
  pkgContents.forEach(pkg => {
    const pathtoes2015 = path.join(pkg.pkgDirPath, 'build/esm');
    try {
      if (fs.readdirSync(pathtoes2015)) {
        fs.readdirSync(pathtoes2015);
        fs.copyFileSync(
          `${pathtoes2015}/tsconfig.json`,
          path.join(pkg.pkgDirPath, 'build/tsconfig.json'),
        );
        fs.unlinkSync(pathtoes2015);
      }
    } catch (err) {
      console.log(err);
    }

    // rimraf.sync(pathtoes2015);
  });
})();
