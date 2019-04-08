// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getPackagesConfigInfo(cwd /*: string */) {
  let project = await bolt.getProject();
  let packages = await bolt.getWorkspaces({ cwd });

  return await Promise.all(
    packages.map(async pkg => {
      let relativeDir = path.relative(project.dir, pkg.dir);
      let isJestConfigExists = await exists(
        path.join(pkg.dir, 'jest.config.js'),
      );
      let isJestFrameworkExists = await exists(
        path.join(pkg.dir, 'jestFrameworkSetup.js'),
      );
      let isResolverExists = await exists(path.join(pkg.dir, 'resolver.js'));
      return {
        dir: pkg.dir,
        name: pkg.name,
        config: pkg.config,
        relativeDir,
        isJestConfigExists,
        isJestFrameworkExists,
        isResolverExists,
      };
    }),
  );
}

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
