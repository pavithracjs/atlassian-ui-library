/* Script to send build data to datadog using Datadogs DogStatsD */
const getPipelinesBuildData = require('../utils/getBuildData')
  .getPipelinesBuildData;
const sendData = require('../utils/sendPayload').sendData;

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER;
    console.log('buildId :', buildId);
    console.log('buildStatus :', process.env.BITBUCKET_EXIT_CODE);
    const buildData = await getPipelinesBuildData(
      'atlassian',
      'atlaskit-mk-2',
      buildId,
    );
    sendData(buildData);
  } catch (err) {
    console.error(`You face some issues while sending data: ${err}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
