// @flow
const bolt = require('bolt');
const path = require('path');
const { exists } = require('./fs');

async function getFilesConfigInfo() {
  let root = process.cwd();
  let filesConfiguration /*: { [key: string]: Object} */ = {
    jestConfig: { name: 'jest.config.js' },
    jestFramework: { name: 'jestFrameworkSetup.js' },
    babelConfig: { name: 'babel.config.js' },
    eslintIgnore: { name: '.eslintignore' },
    eslintTrc: { name: '.eslintrc.json' },
    flowConfig: { name: '.flowconfig' },
    styleLintIgnore: { name: '.stylelintignore' },
    styleLintTrc: { name: '.stylelintrc' },
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
  let isBabel = filesConfiguration['babelConfig'].exists;
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
  let isEslint =
    filesConfiguration['eslintIgnore'].exists ||
    filesConfiguration['eslintTrc'].exists;
  let isFlow = filesConfiguration['flowConfig'].exists;
  let isStyleLint =
    filesConfiguration['styleLintIgnore'].exists ||
    filesConfiguration['styleLintTrc'].exists;
  return {
    filesConfiguration,
    isBabel,
    isEslint,
    isFlow,
    isKarma,
    isTypecheck,
    isTsLint,
    isStyleLint,
    isTest,
  };
}

const CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME /*: { [key: string]: (file: Object) => boolean } */ = {
  babel: file => file.isBabel,
  browserstack: file => file.isTest,
  flow: file => file.isFlow,
  karma: file => file.isKarma,
  eslint: file => file.isTsLint,
  stylelint: file => file.isStyleLint,
  typecheck: file => file.isTypecheck,
  tslint: file => file.isTsLint,
  unit: file => file.isTest,
  vr: file => file.isTest,
  webdriver: file => file.isTest,
};

module.exports = {
  getFilesConfigInfo,
  CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME,
};
