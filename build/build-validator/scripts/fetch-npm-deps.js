#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const child_process = require('child_process');
const rimraf = require('rimraf');
const pLimit = require('p-limit');
const { getNpmDistPath, getAllPublicPackages } = require('./utils');

const exec = util.promisify(child_process.exec);

// Limit fetches to at most 25 in parallel
const limit = pLimit(25);

const lockFileName = 'fetch.lock';

function distExists(pkgName, pkgVersion) {
  const distPath = getNpmDistPath(pkgName);
  if (!fse.existsSync(distPath)) {
    return false;
  }
  const distStat = fse.statSync(distPath);
  if (!distStat.isDirectory()) {
    return false;
  }
  const dirContents = fse.readdirSync(distPath);
  return (
    dirContents.length > 0 &&
    !dirContents.find(f => f === lockFileName) &&
    dirContents.find(f => f.endsWith(`${pkgVersion}.tgz`))
  );
}

async function fetchDistFromNpm(pkgName, pkgVersion, forceRefetch) {
  // console.log(`Fetching npm dep '${pkgName}'`);
  const distPath = getNpmDistPath(pkgName);
  const distPkgPath = path.join(distPath, 'package');
  if (distExists(pkgName, pkgVersion) && !forceRefetch) {
    console.log(`Using cached ${pkgName}. Use --refetch to refetch`);
    return distPkgPath;
  }

  console.log(`Fetching ${pkgName}...`);
  rimraf.sync(distPath);
  fse.mkdirSync(distPath, { recursive: true });
  // Create a lockfile that is deleted after we fetch and unpack successfully.
  // Used to signal whether a cached dist is corrupt
  const lockFilePath = path.join(distPath, lockFileName);
  fse.closeSync(fse.openSync(lockFilePath, 'w'));
  const { stdout } = await limit(() =>
    exec(`npm pack ${pkgName}@${pkgVersion}`),
  );
  const distTarballPath = stdout.split('\n')[0];
  await exec(`tar -C ${distPath} -xvf ${distTarballPath}`);

  await fse.move(distTarballPath, path.join(distPath, distTarballPath));
  fse.unlinkSync(lockFilePath);
  console.log(
    `Successfully fetched and unpacked ${pkgName} (${distTarballPath}) to ${distPath}`,
  );

  // Npm dists are stored in package
  return distPkgPath;
}

/**
 * fetch-npm-dep [packageName]
 *
 * Fetches `packageName` from npm and stores in the dists folder, provided the package is a public workspace package of this repo
 *
 * If no `packageName` is passed, fetches all public workspace packages in the repo
 *
 * --refetch - force refetch of bundle from npm
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
    return fetchDistFromNpm(pkgName, resolvedPkg.version, opts.force);
  } else {
    const resolvedPromises = await Promise.all(
      allPackages.map(({ name, version }) => {
        return fetchDistFromNpm(name, version, opts.force);
      }),
    );

    console.log(`Fetched ${resolvedPromises.filter(p => !!p).length} packages`);
    return resolvedPromises;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const requiredArgs = args.filter(a => !a.startsWith('--'));
  const flags = args.filter(a => a.startsWith('--'));
  const pkgName = requiredArgs[0];
  const opts = {
    force: flags.includes('--refetch'),
  };
  main(pkgName, opts).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
