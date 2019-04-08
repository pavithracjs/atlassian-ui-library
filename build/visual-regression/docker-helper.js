//@flow
const compose = require('docker-compose');
const path = require('path');
const ip = require('ip');
const exec = require('child_process').execSync;
const imageVersion = require('../pipelines-docker-image/package.json').version;

const cwd = path.join(__dirname);
const dockerPath = path.join('build', 'pipelines-docker-images');
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

async function updateDockerImage() {
  const cmd = `docker images| grep atlassianlabs/atlaskit-mk-2-vr| awk '{print $2}'| head -n 1`;
  const version = await exec(cmd).toString();

  console.log('Latest docker package version:', imageVersion);
  console.log('Local docker image version:', version);

  if (version && imageVersion != version) {
    console.log(
      'Old version of docker image found, updating docker image .....',
    );
    await compose.down({ cwd, log });
    const deleteVRImage = `docker rmi -f visual-regression_chromium:latest`;
    const deleteVRBaseImage = `docker rmi -f atlassianlabs/atlaskit-mk-2-vr:${version}`;
    const deletedVRImage = await exec(deleteVRImage).toString();
    const deletedVRBaseImage = await exec(deleteVRBaseImage).toString();
    console.log(deletedVRImage, deletedVRBaseImage);
  }
}

module.exports = { startDocker, stopDocker, updateDockerImage };
