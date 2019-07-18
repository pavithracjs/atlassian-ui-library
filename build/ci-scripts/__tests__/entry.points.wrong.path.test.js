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

  test('writeEntryPointsPathInPkgJson should error if wrong path', async () => {
    const isTsWrong = false;
    const pkgWrong = testPackagesForWrite[1];
    const pkgFileWrong = pkgWrong.files[1];
    const entryPointDirNameWrong = path.join(pkgWrong.dir, pkgFileWrong);
    const entryPointPkgTsonpathWrong = `${entryPointDirNameWrong}/package.json`;
    try {
      await writeEntryPointsPathInPkgJson(
        isTsWrong,
        pkgWrong,
        pkgFileWrong,
        entryPointDirNameWrong,
      );
      fs.accessSync(entryPointPkgTsonpathWrong);
      dirsToRemove.push(entryPointDirNameWrong);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
