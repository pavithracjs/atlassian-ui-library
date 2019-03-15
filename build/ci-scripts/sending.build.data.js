/* Script to send build data to datadog using Datadogs DogStatsD */
const getPipelinesBuildData = require('../utils/getBuildData')
  .getPipelinesBuildData;
const sendData = require('../utils/sendPayload').sendData;

(async () => {
  const buildId = process.env.BITBUCKET_BUILD_NUMBER;
  const buildData = await getPipelinesBuildData(
    'atlassian',
    'atlaskit-mk-2',
    buildId,
  );
  console.log(buildId);
  console.log(buildData);
  sendData(buildData);
})();
