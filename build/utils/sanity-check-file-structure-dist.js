// @flow
/*
In the past, we had several issues related to building and shipping correctly the dist folder in our packages.
This script will check for each package after having been buit, if it has a dist folder with esm, cjs and for both a version.json.
*/
const fs = require('fs');
const path = require('path');
const { getPackagesInfo } = require('./tools');

const exceptions = [
  '@atlaskit/updater-cli',
  '@atlaskit/dependency-version-analytics',
  '@atlaskit/code-insights',
  '@atlaskit/branch-deploy-product-integrator',
];

const checkForDirEmpty = (folderName /*: string*/) /*: boolean */ => {
  let hasFolder = false;
  try {
    const content = fs.readdirSync(folderName);
    if (content.length > 0) hasFolder = true;
  } catch (err) {
    console.error(err);
  }
  return hasFolder;
};

const checkForFile = (fileName /*: string*/) /*: boolean */ => {
  let hasFile = false;
  try {
    if (fs.existsSync(fileName)) hasFile = true;
  } catch (err) {
    console.error(err);
  }
  return hasFile;
};

const getHasDistAndVersionPackages = (dist /* array<string */) => {
  return dist.map(pkg => ({
    pkgName: pkg.name,
    hasEsm: checkForDirEmpty(`${pkg.dir}/dist/esm`),
    hasCjs: checkForDirEmpty(`${pkg.dir}/dist/cjs`),
    hasVersionInEsm: checkForFile(`${pkg.dir}/dist/esm/version.json`),
    hasVersionInCjs: checkForFile(`${pkg.dir}/dist/cjs/version.json`),
  }));
};

(async () => {
  const cwd = process.cwd();
  const packagesInfo = await getPackagesInfo(cwd);
  const packagesHasDist = getHasDistAndVersionPackages(
    packagesInfo.filter(
      pkg => pkg.dir.includes('/packages') && !exceptions.includes(pkg.name),
    ),
  ).filter(
    pkg =>
      !pkg.hasCjs && !pkg.hasEsm && !pkg.hasCjsVersion && !pkg.hasEsmVersion,
  );
  if (packagesHasDist.length > 0) {
    console.log(
      `Those packages have issues with their dist folders or version.json: ${JSON.stringify(
        packagesHasDist,
      )}`,
    );
    process.exit(1);
  }
})();
