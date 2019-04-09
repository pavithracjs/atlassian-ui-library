// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getFilesConfigInfo(cwd /*: string */) {
  let project = await bolt.getProject();
  let root = cwd;

  return await Promise.all(async () => {
    console.log('path:', await exists(path.join(root, 'jest.config.js')));
    let isJestConfigExists = await exists(path.join(root, 'jest.config.js'));
    let isJestFrameworkExists = await exists(
      path.join(root, 'jestFrameworkSetup.js'),
    );
    let isBabelConfigExists = await exists(path.join(root, 'babel.config.js'));
    let isTsBaseConfigExists = await exists(
      path.join(root, 'tsconfig.base.json'),
    );
    let isTsMediaConfigExists = await exists(
      path.join(root, 'tsconfig.media.json'),
    );
    let isTsEntryPointsConfigExists = await exists(
      path.join(root, 'tsconfig.entry-points.json'),
    );
    let isTsJestConfigExists = await exists(
      path.join(root, 'tsconfig.jest.json'),
    );
    let isTsTypecheckConfigExists = await exists(
      path.join(root, 'tsconfig.typecheck.json'),
    );
    let isTsLintSourcesExists = await exists(
      path.join(root, 'tslint.sources.json'),
    );
    let isProjectorExists = await exists(path.join(root, 'projector.js'));
    let isResolverExists = await exists(path.join(root, 'resolver.js'));

    let isKarma = isProjectorExists;
    let isTypecheck =
      isTsBaseConfigExists ||
      isTsEntryPointsConfigExists ||
      isTsMediaConfigExists ||
      isTsTypecheckConfigExists;
    let isTsLint = isTsLintSourcesExists;
    let isTest =
      isBabelConfigExists ||
      isJestConfigExists ||
      isJestFrameworkExists ||
      isTsJestConfigExists ||
      isResolverExists;

    return {
      isKarma,
      isTypecheck,
      isTsLint,
      isTest,
    };
  });
}

const CONFIG_FILES_TO_FILTERS /*: { [key: string]: (pkg: Object) => boolean } */ = {
  karma: file => file.isKarma,
  typecheck: file => file.isTypecheck,
  tslint: file => file.isTsLint,
  unit: file => file.isTest,
  webdriver: file => file.isTest,
  visualregression: file => file.isTest,
};

module.exports = {
  getFilesConfigInfo,
  CONFIG_FILES_TO_FILTERS,
};
