//@flow
const compose = require('docker-compose');
const path = require('path');
const ip = require('ip');
const exec = require('child_process').execSync;

const cwd = path.join(__dirname);
const log = true;

// ip address is required for docker image to connect to local server
console.log('local ip address:', ip.address());
process.env.HOST_IP = ip.address();

async function startDocker() {
  console.log('starting docker');
  return await compose.upAll({ cwd, log });
}

async function stopDocker() {
  console.log('stopping docker');
  return await compose.stop({ cwd, log });
}

const getDockerImageProdVersion = () =>
  require('../pipelines-docker-image/package.json').version;

const getDockerImageLocalVersion = async () => {
  const cmd = `docker images| grep atlassianlabs/atlaskit-mk-2-vr| awk '{print $2}'| head -n 1`;
  return await exec(cmd).toString();
};

async function isLatestVersion(localVersion /*: string */) {
  const prodVersion = getDockerImageProdVersion();

  console.info('Latest docker image version:', prodVersion);
  console.info('Local docker image version:', localVersion.trim());

  return localVersion && prodVersion === localVersion.trim();
}

async function deleteOldDockerImage() {
  const localVersion = await getDockerImageLocalVersion();
  const isLatest = await isLatestVersion(localVersion);

  if (!isLatest) {
    console.info(
      'Old version of docker image found, updating docker image .....',
    );
    await compose.down({ cwd, log });
    const deleteVRImage = `docker rmi -f visual-regression_chromium:latest`;
    const deleteVRBaseImage = `docker rmi -f atlassianlabs/atlaskit-mk-2-vr:${localVersion}`;
    const deletedVRImage = await exec(deleteVRImage).toString();
    const deletedVRBaseImage = await exec(deleteVRBaseImage).toString();
    console.info(deletedVRImage, deletedVRBaseImage);
  } else {
    console.info('Your docker image is up to date...');
  }
}

module.exports = {
  startDocker,
  stopDocker,
  deleteOldDockerImage,
  isLatestVersion,
  getDockerImageProdVersion,
  getDockerImageLocalVersion,
};
