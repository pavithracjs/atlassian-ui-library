/* Script to send build data to datadog using Datadogs DogStatsD */
const getPipelinesBuildData = require('../utils/getBuildData')
  .getPipelinesBuildData;
const sendData = require('../utils/sendPayload').sendData;
const buildData = require('../../.build-data/build.json');

(async () => {
  try {
    console.log('buildId :', buildData.build_number);
    console.log('buildStatus :', buildData.build_status);
    sendData(buildData);
  } catch (err) {
    console.error(`You face some issues while sending data: ${err}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
