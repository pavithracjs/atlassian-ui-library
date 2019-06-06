// @flow
/* This script creates the folder per entry point and add a package.json that maps the path to the entry point .*/
const bolt = require('bolt');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;

const writeFile = promisify(fs.writeFile);

// // TODO: to remove later, used to test/investigate the build script replace `packages` line 21 by `test`.
// const test = [
//   {
//     dir: '/Users/rbellebon/atlaskit-mk-2/packages/core/type-helpers',
//     name: '@atlaskit/type-helpers',
//     config:{ atlaskit : {}}
//   },
// ];

async function writeEntryPointsPathInPkgJson(
  isTs /*: boolean */,
  pkg /*: Object */,
  pkgFile /*: string */,
  entryPointDirName /*: string*/,
) {
  // Add a package.json
  const types = isTs ? `../dist/esm/${pkgFile}.d.ts` : undefined;
  const entryPointJson = {
    name: `${pkg.name}/${pkgFile}`,
    main: `../dist/cjs/${pkgFile}.js`,
    module: `../dist/esm/${pkgFile}.js`,
    types,
  };
  console.log(entryPointJson);
  try {
    writeFile(
      `${entryPointDirName}/package.json`,
      JSON.stringify(entryPointJson, null, 2),
      err => {
        if (err) throw err;
      },
    );
  } catch (err) {}
}

async function createEntryPointsDirWithPkgJson() {
  const packages = await bolt.getWorkspaces();
  const pkgContents = packages
    .filter(pkg => pkg.dir.includes('/packages'))
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
              !file.includes('.d.ts') &&
              !file.includes('version.json'),
          ),
      };
    });
  for (let pkg of pkgContents) {
    for (let pkgFile of pkg.files) {
      const isTs = pkgFile.includes('.ts');
      pkgFile = path.parse(pkgFile).name;
      const entryPointDirName = path.join(pkg.pkgDirPath, pkgFile);
      try {
        if (!fs.existsSync(entryPointDirName)) {
          fs.mkdirSync(entryPointDirName);
        }
        const dirContents = fs.readdirSync(entryPointDirName);
        if (
          dirContents.length > 1 ||
          (dirContents[0] !== 'package.json' && pkgFile !== 'index')
        ) {
          throw Error(
            'Directory outside of src has the same name as a file in src/ this is not allowed',
          );
        }
        await writeEntryPointsPathInPkgJson(
          isTs,
          pkg,
          pkgFile,
          entryPointDirName,
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
}
createEntryPointsDirWithPkgJson();

module.exports = {
  writeEntryPointsPathInPkgJson,
  createEntryPointsDirWithPkgJson,
};
