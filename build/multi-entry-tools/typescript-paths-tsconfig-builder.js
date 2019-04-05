const getAlternativeEntryPointAliasMap = require('./module-resolve-map-builder');
const fromEntries = require('./utils/fromEntries');

async function main() {
  const mapping = await getAlternativeEntryPointAliasMap();
  const paths = fromEntries(
    Object.entries(mapping).map(([moduleName, path]) => {
      return [[moduleName], [path]];
    }),
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
