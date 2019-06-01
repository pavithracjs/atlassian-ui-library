// @flow
/* This script creates the folder per entry point and add a package.json that maps the path to the entry point .*/
const bolt = require('bolt');
const path = require('path');
const fs = require('fs');

// TODO: to remove later, used to test our build script remove packages line 21 by `test`.
// const test = [
//   {
//     dir: '/Users/rbellebon/atlaskit-mk-2/packages/elements/mention',
//     name: '@atlaskit/mention',
//     config:{ atlaskit : {}}
//   },
// ];

(async () => {
  const packages = await bolt.getWorkspaces();
  const pkgContents = packages
    .filter(
      pkg =>
        pkg.dir.includes('/packages') &&
        pkg.config.atlaskit &&
        !pkg.config.atlaskit.internal,
    )
    .map(pkg => {
      return {
        name: pkg.name,
        pkgDirPath: pkg.dir,
        files: fs
          .readdirSync(path.join(pkg.dir, 'src'))
          .filter(
            file =>
              file.includes('.') &&
              path.parse(file).name &&
              !file.includes('.d.ts'),
          ),
      };
    });
  pkgContents.forEach(pkg => {
    for (let pkgFile of pkg.files) {
      pkgFile = path.parse(pkgFile).name;
      const entryPointDirName = path.join(pkg.pkgDirPath, pkgFile);
      // Create the entrypoint directory
      if (!fs.existsSync(entryPointDirName)) {
        fs.mkdirSync(entryPointDirName);
      }
      // Add a package.json
      const entryPointJson = {
        name: `${pkg.name}/${pkgFile}`,
        main: `../dist/cjs/${pkgFile}.js`,
        module: `../dist/esm/${pkgFile}.js`,
        types: `../dist/esm/${pkgFile}.d.ts`,
      };
      fs.writeFile(
        `${entryPointDirName}/package.json`,
        JSON.stringify(entryPointJson),
        'utf8',
        err => {
          if (err) throw console.error(err);
        },
      );
    }
  });
})();
