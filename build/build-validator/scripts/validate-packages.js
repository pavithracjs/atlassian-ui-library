#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const packlist = require('npm-packlist');
const child_process = require('child_process');
const { getNpmDistPath } = require('./utils');
const fetchNpmDeps = require('./fetch-npm-deps');

const exec = util.promisify(child_process.exec);

const getRepoPkgPath = pkgName =>
  path.join(process.cwd(), 'node_modules', pkgName);

function copyFiles(srcDir, destDir, files) {
  return Promise.all(
    files.map(f => fse.copy(path.join(srcDir, f), path.join(destDir, f))),
  );
}

// This lives in global scope so we can easily remove the dir in our global error handler
let tmpDir;

async function validatePackage(pkgName, quiet, refetch = false) {
  const npmDistPath = await fetchNpmDeps(pkgName, {
    refetch,
  });
  const repoPkgPath = getRepoPkgPath(pkgName);
  tmpDir = path.join(repoPkgPath, 'tmp');
  await fse.remove(tmpDir);
  await fse.mkdir(tmpDir);
  const packedRepoFiles = await packlist({ path: repoPkgPath });
  // Copy files that would be published to a temp dir for easy diffing
  await copyFiles(repoPkgPath, tmpDir, packedRepoFiles);
  let valid = true;
  try {
    await exec(`diff -${quiet ? 'q' : ''}ur '${npmDistPath}' '${tmpDir}'`);
    console.log(`${pkgName} passed validation`);
  } catch (e) {
    if (e.code === 1) {
      // If exit code is 1, there is a diff between the two dirs
      valid = false;
      console.log(`${pkgName} differs from npm`);
      console.log(e.stdout);
    } else {
      throw e;
    }
  }
  await fse.remove(tmpDir);
  return valid;
}

/**
 * validate-packages
 *
 * Validates `packageName` in the repo against what is downloaded from npm in `dists` folder
 *
 * @param `packageName` string Name of the package to validate. If missing will validate all packages
 * @param `opts` {
 *  `quiet`: boolean Whether to only show files that have changed or the whole file diffs
 *  `refetch`: boolean Whether to refetch the package from npm before comparing
 * }
 *
 * Assumes that the package has already been built.
 *
 * If no `packageName` is passed, compares all packages under `optionalDependencies`.
 */
async function main(pkgName, opts) {
  if (pkgName) {
    // Compare single package
    await validatePackage(pkgName, opts.quiet, opts.refetch);
  } else {
    // Compare all
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const requiredArgs = args.filter(a => !a.startsWith('--'));
  const flags = args.filter(a => a.startsWith('--'));
  const pkgName = requiredArgs[0];
  const opts = {
    quiet: flags.includes('--quiet'),
    refetch: flags.includes('--refetch'),
  };
  main(pkgName, opts).catch(e => {
    console.error(e);
    fse.removeSync(tmpDir);
    process.exit(1);
  });
}

module.exports = main;
