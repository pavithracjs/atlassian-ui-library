#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const packlist = require('npm-packlist');
const child_process = require('child_process');
const fetchNpmDeps = require('./fetch-npm-deps');
const { getAllPublicPackages } = require('./utils');

const exec = util.promisify(child_process.exec);

function copyFiles(srcDir, destDir, files) {
  return Promise.all(
    files.map(f => fse.copy(path.join(srcDir, f), path.join(destDir, f))),
  );
}

async function validatePackage(pkgName, pkgDir, quiet, refetch = false) {
  const npmDistPath = await fetchNpmDeps(pkgName, {
    refetch,
  });
  let tmpDir = path.join(pkgDir, 'tmp');
  try {
    await fse.remove(tmpDir);
    await fse.mkdir(tmpDir);
    const packedRepoFiles = await packlist({ path: pkgDir });
    // Copy files that would be published to a temp dir for easy diffing
    await copyFiles(pkgDir, tmpDir, packedRepoFiles);
    let valid = true;
    try {
      await exec(
        `diff -W 100 -${quiet ? 'q' : ''}ur '${npmDistPath}' '${tmpDir}'`,
        {
          maxBuffer: 1024 * 500,
        },
      );
      console.log(`${pkgName} passed validation`);
    } catch (e) {
      if (e.code === 1) {
        // If exit code is 1, there is a diff between the two dirs
        valid = false;
        console.error(`${pkgName} differs from npm`);
        console.error(e.stdout);
      } else {
        throw e;
      }
    }
    await fse.remove(tmpDir);

    return valid;
  } catch (e) {
    // Cleanup temp dir before propogating any errors
    await fse.remove(tmpDir);
    throw e;
  }
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
  const allPackages = await getAllPublicPackages(
    path.join(process.cwd(), '..'),
  );
  if (pkgName) {
    const resolvedPkg = allPackages.find(p => p.name === pkgName);
    if (!resolvedPkg) {
      throw Error(
        `Dependency ${pkgName} is not a public package in the atlaskit repo.`,
      );
    }
    // Compare single package
    return validatePackage(
      resolvedPkg.name,
      resolvedPkg.dir,
      opts.quiet,
      opts.refetch,
    );
  } else {
    // Compare all
    // Fetch deps first in parallel
    await fetchNpmDeps(undefined, {
      force: opts.refetch,
    });

    const results = [];
    // Executing sequentially makes output more readable
    for (const { dir, name } of allPackages) {
      // Set refetch to false since we've already fetched beforehand
      const valid = await validatePackage(name, dir, opts.quiet, false);
      results.push({ name, valid });
    }

    const validPackages = results.filter(({ valid }) => valid);
    const invalidPackages = results.filter(({ valid }) => !valid);

    console.log(`Validated ${results.filter(p => !!p).length} packages`);

    if (validPackages.length > 0) {
      console.log(`${validPackages.length} packages passed validation`);
      console.log(`${validPackages.map(p => p.name).join(', ')}`);
    }

    if (invalidPackages.length > 0) {
      console.error(`${invalidPackages.length} packages failed validation`);
      console.error(`${invalidPackages.map(p => p.name).join(', ')}`);
    }

    return invalidPackages.length === 0;
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
  main(pkgName, opts)
    .then(success => {
      if (!success) {
        console.error('Validation failed, exiting with non-zero status code');
        process.exit(1);
      }
    })
    .catch(e => {
      console.error(e);
      process.exit(2);
    });
}

module.exports = main;
