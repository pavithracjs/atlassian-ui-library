const getAlternativeEntryPointAliasMap = require('./module-resolve-map-builder');
const fromEntries = require('./utils/fromEntries');

async function main() {
  const mapping = await getAlternativeEntryPointAliasMap();
  const cwd = process.cwd();
  const paths = fromEntries(
    Object.entries(mapping).map(([moduleName, path]) => {
      return [[moduleName], [path.replace(cwd, '../..')]];
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
