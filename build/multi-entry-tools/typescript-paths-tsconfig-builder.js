const getAlternativeEntryPointAliasMap = require('./module-resolve-map-builder');
const fromEntries = require('./utils/fromEntries');

async function main() {
  const isProjectLevel = process.argv[2] === '--project';

  const mapping = await getAlternativeEntryPointAliasMap();
  const cwd = process.cwd();
  const paths = fromEntries(
    Object.entries(mapping)
      .filter(([, path]) => path.includes('/packages/'))
      .map(([moduleName, modulePath]) => {
        const modulePattern = moduleName.replace('/index', '');
        const resolutionPath = modulePath
          .replace('/index', '/')
          .replace(/(\.tsx?|\.js)$/, '');

        return [
          [modulePattern],
          [
            resolutionPath.replace(`${cwd}/packages`, '../..'),
            resolutionPath.replace(`${cwd}/`, './'),
          ],
        ];
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
