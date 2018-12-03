const {
  getChangedPackagesSinceMaster,
} = require('@atlaskit/build-utils/packages');
const path = require('path');
const bolt = require('bolt');
const { promisify } = require('util');
const fs = require('fs');
const os = require('os');
const globby = require('globby');
const spawndamnit = require('spawndamnit');
const git = require('../utils/git');

async function getNewFSChangesets(cwd) {
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const paths = await git.getChangedChangesetFilesSinceMaster();

  // $ExpectError
  return paths.map(filePath => require(path.join(projectRoot, filePath)));
}

async function run() {
  try {
    const changedPackages = await getChangedPackagesSinceMaster();

    // Real
    // changedPackages.forEach(async pkg => await verifyPackage(pkg));
    // Testing
    await verifyPackage(changedPackages[0]);
  } catch (e) {
    console.log(e);
  }
}

run();

async function verifyPackage(package) {
  await bolt.workspacesExec({
    command: 'npm',
    commandArgs: ['pack'],
    spawnOpts: {},
    filterOpts: {
      onlyFs: package.relativeDir,
    },
  });

  const tmpdir = await promisify(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);

  const tarballs = await globby([`${package.dir}/*.tgz`]);
  await Promise.all(
    tarballs.map(
      async tarball => await spawn('yarn', ['add', tarball], { cwd: tmpdir }),
    ),
  );

  // Debug
  const files = await promisify(fs.readdir)(tmpdir);
  console.log({ tmpdir, files });
}

function spawn(...args) {
  const child = spawndamnit(...args);
  child.on('stdout', log());
  child.on('stderr', log('error'));
  return child;
}

const log = (type = 'log') => data =>
  // eslint-disable-next-line
  console[type](data.toString());
