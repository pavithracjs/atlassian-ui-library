const getAlternativeEntryPointAliasMap = require('./module-resolve-map-builder');
const fromEntries = require('./utils/fromEntries');

async function main() {
  const mapping = await getAlternativeEntryPointAliasMap();
  const cwd = process.cwd();
  const paths = fromEntries(
    Object.entries(mapping)
      .filter(([, path]) => path.includes('/packages/'))
      .map(([moduleName, path]) => {
        return [[moduleName], [path.replace(`${cwd}/packages`, '../..')]];
      }),
  );
  console.log(
    '/* This file is auto-generated to get multi entry points to type check correctly */',
  );
  console.log(
    '/* When you add a new entry point in src/ rebuild it by running:  bolt build:multi-entry-point-tsconfig */',
  );

  console.log(
    JSON.stringify(
      {
        compilerOptions: {
          paths,
        },
      },
      null,
      2,
    ),
  );
}

main();
