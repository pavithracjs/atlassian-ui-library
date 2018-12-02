#!/usr/bin/env node
// @flow

const { promisify } = require('util');
const path = require('path');
const os = require('os');
const globby = require('globby');
const meow = require('meow');
const fs = require('fs-extra');
const ora = require('ora');
const async = require('async');

const { spawn, allExists, getExitCode, deepMergeConfig } = require('./utils');

const { install, compile, verify, print } = require('./steps');

/*::
export type Fields = 'main' | 'module' | 'jsnext:main' | 'types' | 'browser';

export type PackageConfig = {
  name: string,
  private: boolean,
  packageVerify?: VerifyConfig,
  peerDependencies?: {
    [depName: string]: string
  },
  main: string,
  module: string,
  'jsnext:main': string,
  types: string,
  browser: string,
  [field: string]: any
}

export type VerifyConfig = {
  fieldMatch?: {
    [fieldName: string]: string
  },
  fields?: Array<Fields>,
  customPaths?: Array<string>,
  peerDependencyResolution?: Map<string, string>
}
*/

const cli = meow({
  help: `
  Usage:
    $ package-verify <package-path>

  Options
    --config, -c  Provide a config to verify extra fields

  Example
    $ package-verify . -c package-verify.config.json
  `,
  flags: {
    config: {
      type: 'string',
      alias: 'c',
    },
  },
});

async function run() {
  const cwd = process.cwd();
  let globalConfig = {};
  if (cli.flags.config) {
    globalConfig = await promisify(fs.readJSON)(path.resolve(cli.flags.config));
  }

  const packagePaths = cli.input.length ? cli.input : [cwd];

  try {
    // We need to cater for large amount of packages in monorepos
    // We only run 5 packages at a time.
    async.mapLimit(
      packagePaths,
      5,
      async packagePath => {
        const result = await runPackage(packagePath, globalConfig);
        return result;
      },
      (err, results) => {
        if (err) throw err;

        if (results.filter(Boolean).length === 0) {
          cli.showHelp();
        }

        process.exit(getExitCode(results));
      },
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();

async function runPackage(packagePath, globalConfig) {
  const packageExists = await allExists(packagePath, ['package.json']);
  if (!packageExists) {
    return;
  }

  const pkg /*: PackageConfig */ = await promisify(fs.readJSON)(
    path.join(packagePath, 'package.json'),
    {},
  );

  if (pkg.private) {
    console.warn(`Can't verify private package`, pkg.name);
    return true;
  }

  const { tmpdir, ...results } = await verifyPackage(
    pkg,
    path.resolve(packagePath),
    globalConfig,
  );
  const compiler = ora(`${pkg.name} compiling`).start();
  const { webpackStats, entryPoints } = await compile(pkg.name, tmpdir);

  const compileError = webpackStats.hasErrors();

  if (!compileError) {
    compiler.succeed(`${pkg.name} compiled`);
  } else {
    compiler.fail(`${pkg.name} compile failed`);
  }

  print(pkg.name, results, {
    stats: webpackStats.toJson().assetsByChunkName,
    entryPoints,
  });

  if (compileError) {
    console.error(
      webpackStats.toString({
        colors: true,
      }),
    );
  }

  // FIXME complete hack to fit into current result structure.
  results.compile = {
    found: !compileError,
  };
  return results;
}

async function verifyPackage(
  pkgConfig /*: PackageConfig */,
  cwd,
  globalConfig /*: VerifyConfig */,
) {
  const tmpdir = await promisify(fs.mkdtemp)(
    path.join(os.tmpdir(), 'bolt-package-verify-'),
  );

  const localConfig = pkgConfig.packageVerify || {};
  // Do a deep merge on all fields.
  const verifyConfig = deepMergeConfig(globalConfig, localConfig);

  await installStep(pkgConfig, cwd, tmpdir, verifyConfig);
  return await verify(verifyConfig, tmpdir, pkgConfig);
}

async function installStep(pkgConfig, cwd, tmpdir, globalConfig) {
  const installer = ora(`${pkgConfig.name} installing`).start();

  await spawn('npm', ['pack'], { cwd });

  installer.text = `${pkgConfig.name} installing`;
  const tarballs = await globby(`${cwd}/*.tgz`);
  await install(tmpdir, pkgConfig.peerDependencies, tarballs, globalConfig);
  installer.succeed(`${pkgConfig.name} packed & installed`);
}
