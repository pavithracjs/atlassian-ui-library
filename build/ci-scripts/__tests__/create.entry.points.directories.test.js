import fs from 'fs';
import path from 'path';
import {
  writeEntryPointsPathInPkgJson,
  createEntryPointsDirWithPkgJson,
} from '../create.entry.points.directories';

const testPackagesForWrite = [
  {
    dir: path.join(process.cwd(), 'packages/core/badge'),
    name: '@atlaskit/badge',
    files: ['entryA', 'entryB.ts', 'version.json'],
  },
  {
    dir: path.join(process.cwd(), 'packages/core/avatar'),
    name: '@atlaskit/avatar',
    files: ['entryA', 'entryB.js', 'types.d.ts'],
  },
];
let isTs = false;
let pkg = testPackagesForWrite[0];
let pkgFile = pkg.files[1];
let entryPointDirName = path.join(pkg.dir, pkgFile);
let filesToRemove = [];
let entryPointPkgJsonpath = `${entryPointDirName}/package.json`;

afterAll(() => {
  filesToRemove.forEach(file => fs.unlink(file));
});

test.skip('writeEntryPointsPathInPkgJson should error if wrong path', async () => {
  await writeEntryPointsPathInPkgJson(isTs, pkg, pkgFile, entryPointDirName);
  filesToRemove.push(entryPointPkgJsonpath);
  try {
    fs.accessSync(entryPointPkgJsonpath);
  } catch (err) {
    expect(err).toBeDefined();
  }
});
test('writeEntryPointsPathInPkgJson should write a file with the correct path to entry points js file', async () => {
  pkgFile = pkg.files[0];
  entryPointDirName = path.join(pkg.dir, pkgFile);
  entryPointPkgJsonpath = `${entryPointDirName}/package.json`;
  filesToRemove.push(entryPointPkgJsonpath);
  console.log(isTs, pkg, pkgFile, entryPointDirName);
  await writeEntryPointsPathInPkgJson(isTs, pkg, pkgFile, entryPointDirName);
  filesToRemove.push(entryPointPkgJsonpath);
  try {
    expect(fs.accessSync(entryPointPkgJsonpath)).toBeTruthy();
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

// TODO: Add non packages like website and build
// TODO: check writeEntryPointsPathInPkgJson
// TOOD: check that the function generate the correct file
