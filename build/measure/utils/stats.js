const path = require('path');
const fs = require('fs');
const { fStats, fExists } = require('./fs');

function buildStats(outputPath, statsGroups) {
  return statsGroups.reduce((acc, group) => {
    return group.stats.reduce((acc, stat) => {
      if (stat.group) {
        acc.push(...buildStats(outputPath, [stat]));
        return acc;
      }

      if (!stat.fileName) return acc;

      const filePath = path.resolve(outputPath, stat.fileName);
      const pathToPkg = outputPath.split('/.')[0];
      const packageVersion = require(`${pathToPkg}/package.json`).version;
      const packageName = require(`${pathToPkg}/package.json`).name;
      const packageTeam = require(`${pathToPkg}/package.json`).atlaskit.team;
      // CHANGED_MAIN_PACKAGES return only the packages that have changed since master.
      // CHANGED_PACKAGES - use for the main scripts - can return either only the packages that have changed since master or
      // those packages and includes their dependents if the flag --dependent='direct' is set.
      // The goal of this code below is to check if the tool runs against the main changed package or a dependent.
      const mainPkgs = process.env.CHANGED_MAIN_PACKAGES
        ? JSON.parse(process.env.CHANGED_MAIN_PACKAGES)
            .map(pkg => path.join(process.cwd(), pkg))
            .includes(pathToPkg)
          ? true
          : false
        : false;

      if (!fExists(filePath)) return acc;

      acc.push({
        team: packageTeam,
        package: packageName,
        version: packageVersion,
        dependent: !mainPkgs,
        id: stat.id,
        name: stat.name,
        threshold: stat.threshold,
        stats: fStats(filePath),
      });
      return acc;
    }, acc);
  }, []);
}

/**
 * Creates an array of all packages groups in the repo
 * and cacheGroups for them.
 */
function createAtlaskitStatsGroups(packagesDir, packagePath) {
  const packageVersion = require(`${packagesDir}/${packagePath}/package.json`)
    .version;
  const packageName = require(`${packagesDir}/${packagePath}/package.json`)
    .name;

  return fs
    .readdirSync(packagesDir)
    .filter(gr => !gr.startsWith('.'))
    .map(name => {
      const chunkName = `atlaskit-${name}`;
      const test = module =>
        module.context &&
        // is inside packages directory
        module.context.includes(`packages/${name}/`) &&
        // ignore a package that is being measured
        !module.context.includes(packagePath);

      return {
        name,
        group: true,
        stats: [
          {
            team: name,
            package: packageName, // replacing 'core/button' by button
            version: packageVersion,
            id: `atlaskit.${name}.main`,
            name: 'main',
            fileName: `${chunkName}.js`,
            cacheGroup: {
              name: chunkName,
              test,
              enforce: true,
              chunks: 'all',
              priority: -5,
            },
          },
          {
            team: name,
            package: packageName,
            id: `atlaskit.${name}.async`,
            name: 'async',
            fileName: `${chunkName}-async.js`,
            cacheGroup: {
              name: `${chunkName}-async`,
              test,
              enforce: true,
              chunks: 'async',
              priority: 5,
            },
          },
        ],
      };
    });
}

function diff(origOldStats, origNewStats) {
  const oldStats = [].concat(origOldStats);
  const newStats = [].concat(origNewStats);
  const statsWithDiff = [];

  while (oldStats.length) {
    const old = oldStats.shift();
    const matchIndex = newStats.findIndex(st => st.id === old.id);
    if (matchIndex > -1) {
      let isTooBig;
      const match = newStats[matchIndex];
      const gzipSizeDiff = match.stats.gzipSize - old.stats.gzipSize;

      if (match.threshold) {
        const maxSize =
          match.threshold * old.stats.gzipSize + old.stats.gzipSize;
        isTooBig = maxSize < match.stats.gzipSize;
      }

      statsWithDiff.push({
        ...match,
        isTooBig,
        stats: {
          ...match.stats,
          originalSize: old.stats.size,
          newSize: match.stats.size,
          sizeDiff: match.stats.size - old.stats.size,
          gzipOriginalSize: old.stats.gzipSize,
          gzipSize: match.stats.gzipSize,
          gzipSizeDiff,
        },
      });

      newStats.splice(matchIndex, 1);
    } else {
      statsWithDiff.push({
        ...old,
        deleted: true,
        stats: {
          size: 0,
          gzipSize: 0,
          sizeDiff: -old.stats.size,
          gzipSizeDiff: -old.stats.gzipSize,
        },
      });
    }
  }

  return [
    ...statsWithDiff,
    ...newStats.map(stat => {
      stat.new = true;
      return stat;
    }),
  ];
}

function clearStats(stats) {
  return stats
    .filter(item => !item.deleted)
    .map(item => {
      const { new: added, ...details } = item;
      return {
        ...details,
        threshold: undefined,
        isTooBig: undefined,
      };
    });
}

module.exports = { buildStats, createAtlaskitStatsGroups, diff, clearStats };
