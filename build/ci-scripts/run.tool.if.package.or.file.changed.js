// @flow
const { getChangedPackagesSinceMaster } = require('../utils/packages');
const { getChangedFilesSinceMaster } = require('../utils/files');
const git = require('../utils/git');
const spawndamnit = require('spawndamnit');
const { getPackagesWithKarmaTests } = require('../karma-config');
const {
  getPackagesInfo,
  PACKAGE_TO_FILTERS_BY_TOOL_NAME,
} = require('@atlaskit/build-utils/getPackagesChangedByTool');
const {
  getFilesConfigInfo,
  CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME,
} = require('@atlaskit/build-utils/getConfigFilesChangedByTool');

/**
 * This is a helper script to return whether or not a certain tool should be run.
 * It works by returning a zero code if a tool should be run, so that the normal usage becomes:
 *
 * `node build/ci-scripts/run.tool.if.package.or.file.changed.js toolName -- yarn toolName`.
 */
(async () => {
  const cwd = process.cwd();
  const args = process.argv.slice(2);

  const dashdashIndex = args.indexOf('--');
  const command = args.slice(dashdashIndex + 1);
  const toolNames = args.slice(0, dashdashIndex);
  console.log(toolNames);
  if (dashdashIndex < 0 || command.length === 0) {
    console.error('Incorrect usage, run it like this:\n');
    console.error(
      '  $ node build/ci-scripts/run.tool.if.package.or.file.changed.js [...tools] -- <...command>\n',
    );
    console.error(
      `Tools: ${Object.keys(PACKAGE_TO_FILTERS_BY_TOOL_NAME).join(
        ', ',
      )} or Files:${Object.keys(CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME).join(
        ', ',
      )}`,
    );
    throw process.exit(1);
  }
  // TODO: think of a way to return filters
  let filtersToolsPerPackageOrFilter = toolNames.map(toolName => {
    let filterFn = {
      packagesToFilter: PACKAGE_TO_FILTERS_BY_TOOL_NAME[toolName],
      configFilesToFilter: CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME[toolName],
    };
    if (!filterFn) {
      console.error(
        `Invalid tool name: "${toolName}" (${Object.keys(
          PACKAGE_TO_FILTERS_BY_TOOL_NAME,
        ).join(', ')}) or Files:${Object.keys(
          CONFIG_FILES_TO_FILTERS_BY_TOOL_NAME,
        ).join(', ')}`,
      );
      throw process.exit(1);
    }

    return filterFn;
  });

  let [packages, files, changedPackages, changedFiles] = await Promise.all([
    getPackagesInfo(cwd),
    getFilesConfigInfo(),
    getChangedPackagesSinceMaster(),
    getChangedFilesSinceMaster(),
  ]);

  const changedPackageDirs = changedPackages.map(pkg => pkg.dir);
  console.log(filtersToolsPerPackageOrFilter);
  const packageFilters = filtersToolsPerPackageOrFilter.filter(
    package => package.packagesToFilter,
  );
  const fileFilters = filtersToolsPerPackageOrFilter.filter(
    file => file.configFilesToFilter,
  );
  console.log(packageFilters, fileFilters);
  packageFilters.push(pkg => changedPackageDirs.includes(pkg.dir));

  let matchedPackages = !!packages.find(pkg =>
    packageFilters.every(filter => filter(pkg)),
  );

  let matchedFiles = !!files.find(file =>
    fileFilters.every(filter => filter(file)),
  );
  console.log('matched', matchedFiles, matchedPackages);
  if (!matchedPackages) {
    throw process.exit(0);
  }

  try {
    let res = await spawndamnit(command[0], command.slice(1), {
      stdio: 'inherit',
      tty: (process.stdout && process.stdout.isTTY) || false,
    });

    throw process.exit(res.code);
  } catch (err) {
    if (err instanceof spawndamnit.ChildProcessError) {
      throw process.exit(err.code);
    } else {
      throw process.exit(1);
    }
  }
})();
