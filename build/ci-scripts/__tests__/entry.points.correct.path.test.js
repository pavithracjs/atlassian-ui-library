import fs from 'fs';
import path from 'path';
const bolt = require('bolt');

import {
  writeEntryPointsPathInPkgJson,
  createEntryPointsDirWithPkgJson,
} from '../createEntryPointsUtils';

jest.spyOn(global.console, 'log').mockImplementation(() => {});

const testPackagesForWrite = [
  {
    dir: path.join(process.cwd(), 'packages/core/badge'),
    name: '@atlaskit/badge',
    files: ['index', 'theme.ts', 'version.json'],
  },
  {
    dir: path.join(process.cwd(), 'packages/core/avatar'),
    name: '@atlaskit/avatar',
    files: ['entryA', 'entryB.js', 'types.d.ts'],
  },
];

function deleteDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  const entryPaths = fs.readdirSync(directoryPath);
  entryPaths.forEach(entryPath => {
    const resolvedPath = path.resolve(directoryPath, entryPath);
    if (fs.lstatSync(resolvedPath).isDirectory()) {
      deleteDirectory(resolvedPath);
    } else {
      fs.unlinkSync(resolvedPath);
    }
  });
  fs.rmdirSync(directoryPath);
}

let dirsToRemove = [];
describe('Entrypoints', () => {
  beforeEach(() => {
    dirsToRemove.forEach(file => deleteDirectory(file));
  });
  afterEach(() => {
    dirsToRemove.forEach(file => deleteDirectory(file));
    jest.resetAllMocks();
  });

  test('writeEntryPointsPathInPkgJson should write a file with the correct path to entry points ts file', async () => {
    const isTs = true;
    const pkgTs = testPackagesForWrite[0];
    const pkgFileTs = pkgTs.files[0];
    const entryPointDirNameTs = path.join(pkgTs.dir, pkgFileTs);

    try {
      fs.mkdirSync(entryPointDirNameTs);
      dirsToRemove.push(entryPointDirNameTs);
      await writeEntryPointsPathInPkgJson(
        isTs,
        pkgTs,
        pkgFileTs,
        entryPointDirNameTs,
      );
      console.log('Ts > Entry point directory: ', entryPointDirNameTs);
      const entryPointDirTs = fs.readdirSync(entryPointDirNameTs);
      expect(entryPointDirTs).toContain('package.json');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  test('writeEntryPointsPathInPkgJson should write a file with the correct path to entry points js file', async () => {
    const isTs = false;
    const pkgJs = testPackagesForWrite[1];
    const pkgFileJs = pkgJs.files[0];
    const entryPointDirNameJs = path.join(pkgJs.dir, pkgFileJs);

    try {
      fs.mkdirSync(entryPointDirNameJs);
      dirsToRemove.push(entryPointDirNameJs);
      await writeEntryPointsPathInPkgJson(
        isTs,
        pkgJs,
        pkgFileJs,
        entryPointDirNameJs,
      );
      // We need this console.log to make sure the test is correctly running.
      console.log(entryPointDirNameJs);
      const entryPointDirJs = fs.readdirSync(entryPointDirNameJs);
      expect(entryPointDirJs).toContain('package.json');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });
});
