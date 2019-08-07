const fetch = require('node-fetch');
const chalk = require('chalk');
const spawndamnit = require('spawndamnit');
const prettyjson = require('prettyjson');
const pWaitFor = require('p-wait-for');

const CDN_URL_BASE =
  'http://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts';

// This function needs to be shared between the cli and the main node entry point
// so that they can print different error messages
function validateOptions(commitHash, options = {}) {
  const errors = [];
  const { engine, cmd, timeout, interval } = options;

  if (!commitHash || commitHash.length < 12) {
    errors.push('Commit hash is required and must be at least 12 characters');
  }
  if (!['yarn', 'bolt'].includes(engine)) {
    errors.push('engine must be one of [yarn, bolt]');
  }
  if (!['add', 'upgrade'].includes(cmd)) {
    errors.push('cmd must be one of [add, upgrade]');
  }
  if (timeout < 1) {
    errors.push('timeout must be more than 1ms');
  }
  if (interval < 1) {
    errors.push('interval be more than 1ms');
  }

  return errors;
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

async function getManifestForCommit(commitHash, options = {}) {
  const manifestUrl = `${CDN_URL_BASE}/${commitHash}/dists/manifest.json`;
  const { log } = options;
  const { interval, timeout } = options;

  log(`Fetching manifest from ${manifestUrl}`);

  await pWaitFor(() => urlExists(manifestUrl, options), { interval, timeout });
  const manifest = await fetchVerbose(manifestUrl, options);

  return manifest;
}

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

/**
 * Might look weird to have this extra wrapping function, but its so that when requiring from
 * node we can throw an error that can be caught, and from the cli we can print them and correctly
 * process.exit
 */
async function installFromCommit(fullCommitHash = '', userOptions = {}) {
  const defaultOptions = {
    dryRun: false,
    verbose: false,
    engine: 'yarn',
    cmd: 'add',
    packages: 'all',
    timeout: 20000,
    interval: 5000,
  };
  const options = {
    ...defaultOptions,
    ...userOptions,
  };
  const commitHash = fullCommitHash.substr(0, 12);
  const errors = validateOptions(commitHash, options);

  if (errors.length !== 0) {
    throw new Error(errors.join('\n'));
  }

  return _installFromCommit(commitHash, options);
}

async function _installFromCommit(commitHash = '', options = {}) {
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

module.exports = {
  installFromCommit,
  _installFromCommit,
  validateOptions,
};
