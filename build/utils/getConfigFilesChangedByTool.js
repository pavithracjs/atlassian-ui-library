// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getFilesConfigInfo() {
  let root = process.cwd();
  let filesConfiguration = {
    jestConfig: { name: 'jest.config.js' },
    jestFramework: { name: 'jestFrameworkSetup.js' },
    babelConfig: { name: 'babel.config.js' },
    tsConfigBase: { name: 'jtsconfig.base.json' },
    tsConfigMedia: { name: 'tsconfig.media.json' },
    tsConfigEntry: { name: 'tsconfig.entry-points.json' },
    tsConfigJest: { name: 'tsconfig.jest.json' },
    tsConfigTypecheck: { name: 'tsconfig.typecheck.json' },
    tsLintSources: { name: 'tslint.sources.json' },
    projector: { name: 'projector.js' },
    resolver: { name: 'resolver.js' },
  };
  await Promise.all(
    Object.keys(filesConfiguration).map(async fileName => {
      filesConfiguration[fileName].path = path.join(
        root,
        filesConfiguration[fileName].name,
      );
      filesConfiguration[fileName].exists = await exists(
        filesConfiguration[fileName].path,
      );
      return filesConfiguration;
    }),
  ).catch(err => console.error(err));

  let isKarma = filesConfiguration['projector'].exists;
  let isTypecheck =
    filesConfiguration['tsConfigBase'].exists ||
    filesConfiguration['tsConfigEntry'].exists ||
    filesConfiguration['tsConfigMedia'].exists ||
    filesConfiguration['tsConfigTypecheck'].exists;
  let isTsLint = filesConfiguration['tsLintSources'].exists;
  let isTest =
    filesConfiguration['babelConfig'].exists ||
    filesConfiguration['jestConfig'].exists ||
    filesConfiguration['jestFramework'].exists ||
    filesConfiguration['tsConfigJest'].exists ||
    filesConfiguration['resolver'].exists;
  return {
    filesConfiguration,
    isKarma,
    isTypecheck,
    isTsLint,
    isTest,
  };
  // try{
  // const pathToJestConfig = path.join(root, 'jest.config.js');
  // const pathToJestFramework = path.join(root, 'jestFrameworkSetup.js');

  // let isJestConfigExists = await exists(path.join(root, 'jest.config.js'));
  // let isJestFrameworkExists = await exists(
  //   path.join(root, 'jestFrameworkSetup.js'),
  // );
  // let isBabelConfigExists = await exists(path.join(root, 'babel.config.js'));
  // let isTsBaseConfigExists = await exists(
  //   path.join(root, 'tsconfig.base.json'),
  // );
  // let isTsMediaConfigExists = await exists(
  //   path.join(root, 'tsconfig.media.json'),
  // );
  // let isTsEntryPointsConfigExists = await exists(
  //   path.join(root, 'tsconfig.entry-points.json'),
  // );
  // let isTsJestConfigExists = await exists(
  //   path.join(root, 'tsconfig.jest.json'),
  // );
  // let isTsTypecheckConfigExists = await exists(
  //   path.join(root, 'tsconfig.typecheck.json'),
  // );
  // let isTsLintSourcesExists = await exists(
  //   path.join(root, 'tslint.sources.json'),
  // );
  // let isProjectorExists = await exists(path.join(root, 'projector.js'));
  // let isResolverExists = await exists(path.join(root, 'resolver.js'));

  // let isKarma = isProjectorExists;
  // let isTypecheck =
  //   isTsBaseConfigExists ||
  //   isTsEntryPointsConfigExists ||
  //   isTsMediaConfigExists ||
  //   isTsTypecheckConfigExists;
  // let isTsLint = isTsLintSourcesExists;
  // let isTest =
  //   isBabelConfigExists ||
  //   isJestConfigExists ||
  //   isJestFrameworkExists ||
  //   isTsJestConfigExists ||
  //   isResolverExists;
  // return {
  //   isKarma,
  //   isTypecheck,
  //   isTsLint,
  //   isTest,
  // };
  // }
  // } catch (err) {
  //   console.error(err);
  // }
}

const CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME /*: { [key: string]: (pkg: Object) => boolean } */ = {
  karma: file => file.isKarma,
  typecheck: file => file.isTypecheck,
  tslint: file => file.isTsLint,
  unit: file => file.isTest,
  webdriver: file => file.isTest,
  vr: file => file.isTest,
};

module.exports = {
  getFilesConfigInfo,
  CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME,
};
