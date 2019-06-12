import fs from 'fs';
import path from 'path';
const bolt = require('bolt');

import {
  writeEntryPointsPathInPkgJson,
  createEntryPointsDirWithPkgJson,
} from '../createEntryPointsUtils';

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
      console.info('Ts > Entry point directory: ', entryPointDirNameTs);
      const entryPointDirTs = fs.readdirSync(entryPointDirNameTs);
      expect(entryPointDirTs).toContain('package.json');
    } catch (err) {
      expect(err).toBeUndefined();
    }
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
      console.info('Js > Entry point directory: ', entryPointDirNameJs);
      const entryPointDirJs = fs.readdirSync(entryPointDirNameJs);
      expect(entryPointDirJs).toContain('package.json');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  test('createEntryPointsDirWithPkgJson is generating folders', async () => {
    await createEntryPointsDirWithPkgJson();
    const packages = await bolt.getWorkspaces();
    const pkgContents = packages
      .filter(pkg => pkg.dir.includes('/packages'))
      .map(pkg => {
        return {
          name: pkg.name,
          pkgDirPath: pkg.dir,
          files: fs
            .readdirSync(path.join(pkg.dir, 'src'))
            .filter(
              file =>
                file.includes('.') &&
                !file.includes('index') &&
                path.parse(file).name &&
                !file.includes('.d.ts') &&
                !file.includes('version.json'),
            ),
        };
      });
    for (let pkg of pkgContents) {
      for (let pkgFile of pkg.files) {
        const file = path.parse(pkgFile).name;
        const entryPointDirName = path.join(pkg.pkgDirPath, file);
        dirsToRemove.push(entryPointDirName);
        try {
          expect(fs.existsSync(entryPointDirName)).toBeTruthy();
          const dirContent = fs.readdirSync(entryPointDirName);
          expect(dirContent).toContain('package.json');
        } catch (e) {
          throw new Error(
            `${entryPointDirName} folder should exist and should contain a package.json`,
            e,
          );
        }
      }
    }
  });
});
