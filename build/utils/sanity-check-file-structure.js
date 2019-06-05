/*
TypeScript compiler has this weird problem where it sometimes decides to also build
imported code. When this happens the code we want to distribute actually ends up in a sub-dir instead of
the root of the package dir.

For example in editor-core we once ended up with the following structure:
- editor/editor-core/editor-core
- editor/editor-core/elements
- etc...

Where-as expected would be:
- editor/editor-core/index.js
- editor/editor-core/components/*
- etc....

*Update*: we are now shipping entrypoint at the root but under a folder with the entry point name.

This check does a quick compare of the src/ directory with the root of the package dir.
So this check needs to be run *AFTER* the dists are build. This should help us prevent shipping broken code.

*/
const { readFile, readdir } = require('./fs');

/*
Does your package have a path that shouldn't be distributed?
Cool just add it to the exception list
 */
// TODO: Marco: Do we need to add another check to see if the components folder is generated.
const exceptionList = [
  '__tests__',
  '@types',
  'components',
  'themes',
  'Lozenge',
  'Spinner',
];

const main = async () => {
  const [src, root, packageJSON] = await Promise.all([
    readdir('./src'),
    readdir('./'),
    readFile('./package.json').then(res => JSON.parse(res)),
  ]);

  /*
  This check is not relevant for packages that still ship ES5 and ES2015.
  it's also not relevant for private packages because those are allmost all test helpers
  that do funky stuff with their dist anyway (and are never published)
  */
  if (packageJSON.module !== 'index.js' || packageJSON.private) {
    return;
  }
  const missing = src
    .filter(fileName => !exceptionList.includes(fileName))
    .map(fileName => fileName)
    .filter(
      fileName =>
        !fileName.includes('version.json') &&
        !root.includes(fileName.replace(/\.tsx?/, '')),
    );

  if (missing.length > 0) {
    throw new Error(
      `Build files in root are  missing some files or folders: ${missing.join(
        ',',
      )}`,
    );
  }
};

main().catch(err => {
  console.error(err.toString());
  process.exit(1);
});
