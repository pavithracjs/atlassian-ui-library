#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const lodash = require('lodash');
const child_process = require('child_process');
const rimraf = require('rimraf');
const pLimit = require('p-limit');
const { getNpmDistPath, retryFetch } = require('./utils');

const exec = util.promisify(child_process.exec);

// Limit fetches to at most 25 in parallel
const limit = pLimit(25);

const lockFileName = 'fetch.lock';

function distExists(pkgName) {
  const distPath = getNpmDistPath(pkgName);
  if (!fs.existsSync(distPath)) {
    return false;
  }
  const distStat = fs.statSync(distPath);
  if (!distStat.isDirectory()) {
    return false;
  }
  const dirContents = fs.readdirSync(distPath);
  return dirContents.length > 0 && !dirContents.find(f => f === lockFileName);
}

async function fetchDistFromNpm(pkgName, pkgVersion, forceRefetch) {
  // console.log(`Fetching npm dep '${pkgName}'`);

  if (distExists(pkgName) && !forceRefetch) {
    console.log(`Dist already exists for ${pkgName}. Use --force to refetch`);
    return;
  }

  const { stdout, stderr } = await exec(
    `yarn info ${pkgName}@${pkgVersion} --json dist`,
  );

  if (stderr) {
    throw new Error(`Error executing yarn info for ${pkgName}: ${stderr}`);
  }

  const info = JSON.parse(stdout);

  const tarball = lodash.get(info, 'data.tarball');
  if (!tarball) {
    throw new Error(
      `Could not retrieve tarball link from yarn info for ${pkgName}`,
    );
  }

  console.log(`Fetching ${pkgName} from ${tarball}`);
  const distPath = getNpmDistPath(pkgName);
  const distTarballPath = path.join(distPath, path.basename(tarball));
  rimraf.sync(distPath);
  fs.mkdirSync(distPath, { recursive: true });
  const lockFilePath = path.join(distPath, lockFileName);
  fs.closeSync(fs.openSync(lockFilePath, 'w'));
  await limit(() =>
    retryFetch(tarball, {
      cb: (e, retry) =>
        console.log(
          `Encountered error ${
            e.errno
          } when fetching ${tarball}. ${retry} retries left.`,
        ),
    }),
  ).then(
    res =>
      new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(distTarballPath);
        res.body.pipe(dest);
        dest.on('close', () => {
          resolve();
        });
        dest.on('error', reject);
      }),
  );

  // Strip-components extracts the contents out of the package dir in the tarball
  // await tar.extract({
  //   cwd: distPath,
  //   file: distTarballPath,
  //   // strip: 1,
  // });
  await exec(`tar -C ${distPath} -xvf ${distTarballPath}`);
  fs.unlinkSync(lockFilePath);
  console.log(`Successfully fetched and unpacked ${pkgName} to ${distPath}`);

  return true;
}

/**
 * fetch-npm-dep [packageName]
 *
 * Fetches `packageName` from npm and stores in the dists folder, provided the package exists under `optionalDependencies` of this package.json
 *
 * If no `packageName` is passed, fetches all packages under `optionalDependencies`.
 *
 * --force - force refetch of bundle from npm
 */
async function main() {
  const args = process.argv.slice(2);
  const requiredArgs = args.filter(a => !a.startsWith('--'));
  const flags = args.filter(a => a.startsWith('--'));
  const pkgName = requiredArgs[0];
  const force = flags.includes('--force');
  const pkgJson = JSON.parse(fs.readFileSync('package.json'));

  if (pkgName) {
    const pkgVersion = pkgJson.optionalDependencies[pkgName];
    if (!pkgJson || !pkgVersion) {
      throw Error(
        'Dependency does not exist as an optionalDependency in package.json. Add it there first.',
      );
    }
    fetchDistFromNpm(pkgName, pkgVersion, force);
  } else {
    const resolvedPromises = await Promise.all(
      Object.entries(pkgJson.optionalDependencies).map(([name, version]) => {
        return fetchDistFromNpm(name, version, force);
      }),
    );

    console.log(`Fetched ${resolvedPromises.filter(p => !!p).length} packages`);
    return resolvedPromises;
  }
}

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
