const packages = require('@atlaskit/build-utils/packages');
const { promisify } = require('util');
const path = require('path');
const bolt = require('bolt');
const fs = require('fs');
const os = require('os');
const globby = require('globby');

const { spawn } = require('./spawn');

async function run() {
  try {
    const changedPackages = await packages.getChangedPackagesSinceMaster();

    // Real
    // await changedPackages.forEach(async pkg => await verifyPackage(pkg));
    // Testing
    await verifyPackage(
      changedPackages.find(pkg => pkg.name === '@atlaskit/button'),
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

run();

async function verifyPackage(package) {
  await bolt.workspaceExec({
    pkgName: package.name,
    command: 'npm',
    commandArgs: ['pack'],
  });

  const tmpdir = await promisify(fs.mkdtemp)(
    path.join(os.tmpdir(), 'bolt-package-verify-'),
  );

  const tarballs = await globby(`${package.dir}/*.tgz`);
  await installDependencies(tmpdir, package.config.peerDependencies, tarballs);

  /**
   * Run a couple of simple checks to ensure package.json exists
   * The main and module (if defiend) field exists.
   */
  const files = ['package.json', package.config.main];

  if (package.config.module) {
    files.push(package.config.module);
  }

  await exists(path.join(tmpdir, 'node_modules', package.name), files);
}

async function installDependencies(cwd, peerDependencies = [], tarballs = []) {
  if (tarballs.length !== 1) {
    return Promise.reject(`More than one tarball was found: ${tarballs}`);
  }

  const peerDeps = Object.keys(peerDependencies).map(
    dep => `${dep}@${peerDependencies[dep]}`,
  );

  const tarball = tarballs[0];
  return await spawn('yarn', ['add', ...peerDeps, `file:${tarball}`], {
    cwd,
  });
}

/**
 * Run a simple check to see if we can access certain files
 * TODO raise an error if not found.
 */
async function exists(base, files = []) {
  await files.forEach(async file => {
    const absolutePath = path.join(base, file);
    try {
      await promisify(fs.access)(absolutePath);
      console.log(`${absolutePath} exists!`);
    } catch (e) {
      console.error(`${absolutePath} not found`);
    }
  });
}
