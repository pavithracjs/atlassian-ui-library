// Look into the packages
// at the source, we need to grab the file names
// at the root we create a folder with a file name + package.json

const bolt = require('bolt');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');

const regexTS = /\.ts$/;
const regexJS = /\.js$/;
const regexd = /\.d.ts$/;
const regexMap = /\.js.map$/;

const test = [
  {
    dir: '/Users/rbellebon/atlaskit-mk-2/packages/core/tree',
    name: '@atlaskit/tree',
    config: {
      name: '@atlaskit/tree',
      version: '6.0.0',
      description:
        'A React Component for displaying expandable and sortable tree hierarchies',
      license: 'Apache-2.0',
      module: 'index.js',
      'atlaskit:src': 'src/index.js',
      sideEffects: false,
      author: 'Atlassian Pty Ltd',
      repository: 'https://bitbucket.org/atlassian/atlaskit-mk-2',
      maintainers: [Array],
      atlaskit: [Object],
      dependencies: [Object],
      peerDependencies: [Object],
      devDependencies: [Object],
      keywords: [Array],
    },
  },
  {
    dir: '/Users/rbellebon/atlaskit-mk-2/packages/core/type-helpers',
    name: '@atlaskit/type-helpers',
    config: {
      name: '@atlaskit/type-helpers',
      version: '4.0.0',
      description: 'Some helpers for Typescript typing of Atlaskit',
      license: 'Apache-2.0',
      module: 'index.js',
      'atlaskit:src': 'index.ts',
      types: 'index.d.ts',
      sideEffects: false,
      author: 'Atlassian Pty Ltd',
      repository: 'https://bitbucket.org/atlassian/atlaskit-mk-2',
      dependencies: [Object],
      peerDependencies: [Object],
      atlaskit: [Object],
      devDependencies: {},
      keywords: [Array],
    },
  },
];

// create a function that moves the file .d.ts, .js, .js.map//
function moveToEntryPointFolder(pathToFiles, pathToEntryPoint) {
  const filesToMove = identifyFilesToMove();
  filesToMove.forEach(pathToFile => {
    fsExtra.move(pathToFile, pathToEntryPoint, function(err) {
      if (err) return console.error(err);
      console.log(`fully moved the file there ${pathToEntryPoint}`);
    });
  });
}

(async () => {
  const project = await bolt.getProject();
  const packages = await bolt.getWorkspaces();
  const pkgContents = test
    .filter(pkg => pkg.dir.includes('/packages'))
    .map(pkg => {
      return {
        pkgDirPath: pkg.dir,
        files: fs
          .readdirSync(path.join(pkg.dir, 'src'))
          .filter(file => file.match(regexTS)),
      };
    });
  console.log(pkgContents);
  pkgContents.forEach(pkg => {
    for (let file of pkg.files) {
      // copy the actual file and append package.json
      const entryPointDirName = path.join(
        pkg.pkgDirPath,
        file.replace('.ts', ''),
      );
      fs.mkdirSync(entryPointDirName);
      fs.copyFileSync(file);
    }
  });
})();
