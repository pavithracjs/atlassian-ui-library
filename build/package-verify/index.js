const { promisify } = require('util');
const path = require('path');
const bolt = require('bolt');
const os = require('os');
const globby = require('globby');
const meow = require('meow');
const fs = require('fs-extra');

const { spawn } = require('./spawn');

const cli = meow();

async function run() {
  try {
    const workspaces = await bolt.getWorkspaces();
    const packages = workspaces.filter(
      workspace => cli.input.indexOf(workspace.name) !== -1,
    );

    packages.forEach(async pkg => await verifyPackage(pkg));
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
    commandArgs: ['pack', package.name],
  });

  const tmpdir = await promisify(fs.mkdtemp)(
    path.join(os.tmpdir(), 'bolt-package-verify-'),
  );

  const tarballs = await globby(`${package.dir}/*.tgz`);
  await installDependencies(tmpdir, package.config.peerDependencies, tarballs);

  /**
   * Run a couple of simple checks to ensure package.json exists
   * The main and module (if defined) field exists.
   */
  const files = ['package.json', package.config.main];

  if (package.config.module) {
    files.push(package.config.module);
  }

  await exists(path.join(tmpdir, 'node_modules', package.name), files);
}

async function installDependencies(cwd, peerDependencies = [], tarballs = []) {
  if (tarballs.length !== 1) {
    return Promise.reject(
      `More than one tarball was found: ${JSON.stringify(tarballs)}`,
    );
  }

  const peerDeps = Object.keys(peerDependencies).map(
    dep => `${dep}@${peerDependencies[dep]}`,
  );
  // We should only have one tarball.
  // its only an array becuase of the globbing
  const tarball = tarballs[0];
  await spawn('yarn', ['add', ...peerDeps, `file:${tarball}`], {
    cwd,
  });

  // Set up for testing in local pkg
  await spawn(
    'npm',
    [
      'install',
      'https://registry.npmjs.org/@pgleeson/enzyme/-/enzyme-3.3.7.tgz',
      'https://registry.npmjs.org/@pgleeson/enzyme-adapter-react-16/-/enzyme-adapter-react-16-1.1.7.tgz',
      'jest',
      'babel-preset-env',
      'babel-preset-react',
      'react-dom',
    ],
    {
      cwd,
    },
  );

  await spawn('npm', ['install'], { cwd });

  fs.copySync('./build/package-verify/templates/', cwd);

  await spawn('./node_modules/jest/bin/jest.js', { cwd });
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
