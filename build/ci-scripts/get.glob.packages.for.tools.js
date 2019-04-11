// @flow
const {
  getPackagesInfo,
  PACKAGE_TO_FILTERS_BY_TOOL_NAME,
} = require('@atlaskit/build-utils/getPackagesChangedByTool.js');

(async () => {
  let cwd = process.cwd();
  let toolNames = process.argv.slice(2);

  if (!toolNames.length) {
    console.error(
      `Please pass one or more tool names (${Object.keys(
        PACKAGE_TO_FILTERS_BY_TOOL_NAME,
      ).join(', ')})`,
    );
    throw process.exit(1);
  }

  let filters = toolNames.map(toolName => {
    let filterFn = PACKAGE_TO_FILTERS_BY_TOOL_NAME[toolName];

    if (!filterFn) {
      console.error(
        `Invalid tool name: "${toolName}" (${Object.keys(
          PACKAGE_TO_FILTERS_BY_TOOL_NAME,
        ).join(', ')})`,
      );
      throw process.exit(1);
    }

    return filterFn;
  });

  let packages = await getPackagesInfo(cwd);
  let relativePaths = packages
    .filter(pkg => filters.every(filter => filter(pkg)))
    .map(pkg => pkg.relativeDir);

  console.log(
    relativePaths.length > 1 ? `{${relativePaths.join()}}` : relativePaths[0],
  );
})();
