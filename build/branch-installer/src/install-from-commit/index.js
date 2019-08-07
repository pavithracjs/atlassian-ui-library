const fetch = require('node-fetch');
const chalk = require('chalk');
const spawndamnit = require('spawndamnit');
const prettyjson = require('prettyjson');
const pWaitFor = require('p-wait-for');

const CDN_URL_BASE =
  'http://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts';

async function getManifestForCommit(commitHash, options = {}) {
  const manifestUrl = `${CDN_URL_BASE}/${commitHash}/dists/manifest.json`;
  const { interval, timeout } = options;

  await pWaitFor(() => urlExists(manifestUrl, options), { interval, timeout });
  const manifest = await fetchVerbose(manifestUrl, options);

  return manifest;
}

// returns a function used for logging or doing nothing (depending on shouldLog)
// i.e const logAlways = createLogger(true);
// const logInDebugMode = createLogger(flags.debug);
const createLogger = shouldLog => {
  if (shouldLog) {
    return message => {
      if (typeof message === 'string') {
        console.log(chalk.cyan(message));
      } else {
        console.log(prettyjson.render(message));
      }
    };
  }

  return () => {};
};

const urlExists = async (url, options = {}) => {
  const { verboseLog } = options;

  verboseLog(`Checking if url exists: ${url}`);

  let response = await fetch(url, { method: 'HEAD' });
  verboseLog(`HTTP Code ${response.status}`);

  return response.status === 200;
};

const fetchVerbose = async (url, options = {}) => {
  const { verboseLog } = options;
  verboseLog(`Trying to fetch ${url}`);

  let response = await fetch(url);
  verboseLog(`HTTP Code ${response.status}`);
  let result = await response.json();
  verboseLog(result);

  return result;
};

async function installFromCommit(commitHash, options = {}) {
  const log = createLogger(true);
  const verboseLog = createLogger(options.verbose);

  verboseLog('Running with options:');
  verboseLog({ ...options, commitHash });

  const manifest = await getManifestForCommit(commitHash, {
    ...options,
    log,
    verboseLog,
  });
  const packages =
    options.packages === 'all'
      ? Object.keys(manifest)
      : options.packages.split(',');

  const { engine, cmd } = options;
  const cmdArgs = [cmd]; // args that we'll pass to the engine ('add'/'upgrade' pkgName@url pkgName@url)

  packages.forEach(pkg => {
    if (!manifest[pkg]) {
      log(`Error: Unable to find url for ${pkg} in manifest.json`);
    } else {
      const tarUrl = `${CDN_URL_BASE}/${commitHash}/dists/${
        manifest[pkg].tarFile
      }`;
      cmdArgs.push(`${pkg}@${tarUrl}`);
    }
  });

  if (options.dryRun) {
    log('[Dry run] would have run command:');
    log(`$ ${engine} ${cmdArgs.join(' ')}`);
  } else {
    log('Running command:');
    log(`$ ${engine} ${cmdArgs.join(' ')}`);
    await spawndamnit(engine, cmdArgs, { stdio: 'inherit' });
  }
}

module.exports = installFromCommit;
