// @flow
/*::
import type { VerifyConfig } from '../index';
*/
const semver = require('semver');
const { spawn } = require('../utils');

const MISSING_PEER = /requires a peer of ([@/a-z\-0-9\.]+)@(.+) but none is installed/gm;

/**
 * TODO need to limit the amount of installs we run here 🤦‍♂️
 */
module.exports = async function installDependencies(
  cwd /*:string */,
  peerDependencies /*: { [dep: string]: string } */ = {},
  tarballs /*: Array<string> */ = [],
  globalConfig /*: VerifyConfig */,
) {
  if (tarballs.length !== 1) {
    return Promise.reject(
      `More than one tarball was found: ${JSON.stringify(tarballs)}`,
    );
  }

  const npm = initNpm(cwd);
  const peerDeps = Object.keys(peerDependencies)
    .map(dep => `${dep}@${peerDependencies[dep]}`)
    .concat(['webpack', 'webpack-cli']);

  // We should only have one tarball.
  // its only an array becuase of the globbing
  const tarball = tarballs[0];
  await npm('init -y');

  const installProcess = npm(
    `install --production ${peerDeps.join(' ')} ${tarball}`,
  );

  // We need to install peer deps of peer deps.
  // We keep looping til we find no more peer deps
  // Version mismatch could be a real problem here.
  let peerDepRef = new Map();
  let peers = await captureMissingPeerDeps(
    installProcess,
    peerDepRef,
    globalConfig.peerDependencyResolution,
  );
  peers.forEach((value, key) => {
    peerDepRef.set(key, value);
  });

  while (peers && peers.size) {
    const child = npm(
      `install --production ${convertDepsToInstallableString(peers)}`,
    );

    const newPeers = await captureMissingPeerDeps(
      child,
      peerDepRef,
      globalConfig.peerDependencyResolution,
    );
    peers = newPeers;
  }

  // If we have any missing nested peer deps, install them as well.
  await npm('install --production');
};

function initNpm(cwd) {
  return function(cmd) {
    return spawn('npm', cmd.split(' '), { cwd });
  };
}

async function captureMissingPeerDeps(childProcess, refMap, resolutionMap) {
  const peers = new Map();
  let matches;

  childProcess.on('stderr', data => {
    while ((matches = MISSING_PEER.exec(data.toString()))) {
      let dep = matches[1];
      let version = matches[2];

      /**
       * Automating the install of peer deps is quite tricky
       * We allow users to configure resolutions for certain deps.
       */
      if (resolutionMap && resolutionMap.has(dep)) {
        refMap.set(dep, resolutionMap.get(dep) || version);
        peers.set(dep, resolutionMap.get(dep) || version);
        continue;
      }

      if (version.includes('||')) {
        let rangeVersions = version.split('||').map(semver.coerce);
        let maxRange = semver.minSatisfying(rangeVersions, version);
        version = maxRange.version;
      }

      if (versionGreaterThanExistingRef(dep, version, refMap)) {
        refMap.set(dep, version);
        peers.set(dep, version);
      }
    }
  });

  try {
    await childProcess;
  } catch (e) {
    // Bail out if an install fails.
    return new Map();
  }

  return peers;
}

function versionGreaterThanExistingRef(dep, version, refMap) {
  if (!refMap.has(dep)) {
    return true;
  }

  const refVersion = refMap.get(dep);
  return semver.gt(semver.coerce(version), semver.coerce(refVersion));
}

function convertDepsToInstallableString(
  map /*: Map<string, string> */,
) /*: string */ {
  let deps = [];
  for (var [key, value] of map) {
    deps.push(`${key}@${value}`);
  }
  return deps.join(' ');
}
