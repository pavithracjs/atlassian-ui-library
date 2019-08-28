const bolt = require('bolt');
const packages = require('../utils/packages');
const codeCoverageByPackage = require('./jest.codeCoverageThreshold');
/**
 * NOTE: This prints the coverage threshold list by changed packages since master ONLY if they have been commited.
 * It will print them all out as a json array of relative paths
 * i.e: $ node build/ci-scripts/get.code.threshold.for.changed.packages.since.master.js
 * {
 *   "coverageThreshold": {
 *     "packages/core/global-navigation/src":{
 *       "statements":100,
 *       "branches":100,
 *       "functions":100,
 *       "lines":100
 *     }
 *   }
 * }
 * */
(async () => {
  const cwd = process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const changedPackages = await packages.getChangedPackagesSinceMaster();

  const changedPackagesName = changedPackages.map(
    pkg => pkg.relativeDir && pkg.relativeDir.split('/').pop(),
  );

  const atlaskitCoverageReducer = (result, { coverage, pkg }) => ({
    ...result,
    collectCoverageFrom: [
      ...result.collectCoverageFrom,
      `${pkg}/**/*.{js,jsx,ts,tsx}`,
    ],
    coverageThreshold: {
      ...result.coverageThreshold,
      [pkg]: coverage,
    },
  });

  const reducedData = Object.keys(codeCoverageByPackage)
    .filter(pkg => {
      const pkgName = pkg
        .replace('/src', '')
        .split('/')
        .pop();

      return changedPackagesName.find(changedPkg => pkgName === changedPkg);
    })
    .map(pkg => ({ pkg, coverage: codeCoverageByPackage[pkg] }))
    .reduce(atlaskitCoverageReducer, {
      collectCoverageFrom: [],
      coverageThreshold: {},
    });

  console.log(
    Object.keys(reducedData).length === 0 ? {} : JSON.stringify(reducedData),
  );
})();
