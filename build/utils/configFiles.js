// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getPackagesConfigInfo(cwd /*: string */) {
  let project = await bolt.getProject();
  let root = cwd;

  return await Promise.all(async () => {
    let isTsConfigExists = await exists(path.join(root, 'tsconfig.base.json'));
    let isTsLint = await exists(path.join(root, 'jest.config.js'));
    let isJestConfigExists = await exists(path.join(root, 'jest.config.js'));
    let isJestFrameworkExists = await exists(
      path.join(root, 'jestFrameworkSetup.js'),
    );
    let isResolverExists = await exists(path.join(root, 'resolver.js'));
    return {
      isJestConfigExists,
      isJestFrameworkExists,
      isResolverExists,
    };
  });
}
// I need to create a filter vr => file.isFF
// refactor runif toolchanged to accept files too
// 2 objects for config files / packages

const CONFIG_FILES_TO_FILTERS /*: { [key: string]: (pkg: Object) => boolean } */ = {
  jestconfig: pkg => pkg.isJestConfigExists,
  jestframeworksetup: pkg => pkg.isJestFrameworkExists,
  resolver: pkg => pkg.isResolverExists,
};

async function getPackageDirsForConfig(cwd /*: string */) {
  let packages = await getPackagesConfigInfo(cwd);
  let toolGroups = {};

  Object.keys(CONFIG_FILES_TO_FILTERS).map(configName => {
    toolGroups[configName] = packages
      .filter(CONFIG_FILES_TO_FILTERS[configName])
      .map(pkg => pkg.relativeDir);
  });

  return toolGroups;
}

module.exports = {
  getPackagesConfigInfo,
  getPackageDirsForConfig,
  CONFIG_FILES_TO_FILTERS,
};
