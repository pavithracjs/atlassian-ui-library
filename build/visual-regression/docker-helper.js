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

async function isLatestVersion() {
  let result = false;
  const cmd = `docker images| grep atlassianlabs/atlaskit-mk-2-vr| awk '{print $2}'| head -n 1`;
  const prodVersion = require('../pipelines-docker-image/package.json').version;
  const localVersion = await exec(cmd).toString();

  console.info('Latest docker image version:', prodVersion);
  console.info('Local docker image version:', localVersion);

  if (localVersion && prodVersion != localVersion) result = true;

  return result;
}
async function deleteOldDockerImage() {
  if (!isLatestVersion()) {
    console.info(
      'Old version of docker image found, updating docker image .....',
    );
    await compose.down({ cwd, log });
    const deleteVRImage = `docker rmi -f visual-regression_chromium:latest`;
    const deleteVRBaseImage = `docker rmi -f atlassianlabs/atlaskit-mk-2-vr:${version}`;
    const deletedVRImage = await exec(deleteVRImage).toString();
    const deletedVRBaseImage = await exec(deleteVRBaseImage).toString();
    console.info(deletedVRImage, deletedVRBaseImage);
  }
}

module.exports = { startDocker, stopDocker, deleteOldDockerImage };
