#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const packlist = require('npm-packlist');
const child_process = require('child_process');
const { getNpmDistPath } = require('./utils');

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

async function validatePackage(pkgName, quiet) {
  // Get dist path for pkgName
  const npmDistPath = path.join(getNpmDistPath(pkgName), 'package');
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
 * validate-packages [packageName]
 *
 * Validates `packageName` in the repo against what is downloaded from npm in `dists` folder
 *
 * Assumes that the package has already been built.
 *
 * If no `packageName` is passed, compares all packages under `optionalDependencies`.
 */
async function main() {
  const args = process.argv.slice(2);
  const requiredArgs = args.filter(a => !a.startsWith('--'));
  const flags = args.filter(a => a.startsWith('--'));
  const pkgName = requiredArgs[0];
  const quiet = flags.includes('--quiet');
  const pkgJson = JSON.parse(fse.readFileSync('package.json'));

  if (pkgName) {
    // Compare single package
    const pkgVersion = pkgJson.optionalDependencies[pkgName];
    if (!pkgJson || !pkgVersion) {
      throw Error(
        'Dependency does not exist as an optionalDependency in package.json. Add it there first.',
      );
    }
    await validatePackage(pkgName, quiet);
  } else {
    // Compare all
  }
}

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    fse.removeSync(tmpDir);
    process.exit(1);
  });
}

module.exports = main;
