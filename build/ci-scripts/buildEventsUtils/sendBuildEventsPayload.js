// @flow
'use strict';
/*
 * Utilities helper to send the events data to the fabric build stats service.
 */
const axios = require('axios');

/*::
type IStepsDataType = {
  step_name: string,
  step_status: string,
  step_duration: number,
}
*/

/*:: type IBuildEventProperties = {
  build_number : string,
  build_status : string,
  build_time : number,
  build_number_steps : number,
  build_type : string,
  build_name : string,
  build_steps: Array<IStepsDataType>
}
*/
const fabricStatsServiceUrl =
  // Default to localhost to test the service locally.
  process.env.FABRIC_STATS_SERVICE || 'http://localhost:8080';

async function sendBuildEventsPayload(payload /*: IBuildEventProperties */) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      'shared-secret': process.env.FABRIC_BUILD_STATS_SHARED_SECRET,
    },
  };
  const response = await axios.post(
    `${fabricStatsServiceUrl}/api/sendBuildData`,
    payload,
    config,
  );
  console.log(process.env.FABRIC_BUILD_STATS_SHARED_SECRET);
  console.log('response', response);
  if (!response || !response.data) {
    console.log('Something may have gone wrong...');
    process.exit(1);
  }
}

module.exports = { sendBuildEventsPayload };
