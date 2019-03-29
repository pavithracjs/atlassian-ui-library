// @flow
'use strict';
/*
 * Utilities helper to send the data to the fabric build stats service.
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
  process.env.FABRIC_STATS_SERVICE || 'http://localhost:8080';

async function sendData(payload /*: IBuildEventProperties */) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      'shared-secret': process.env.SHARED_SECRET,
    },
  };
  const response = await axios.post(
    `${fabricStatsServiceUrl}/api/sendBuildData`,
    payload,
    config,
  );
  if (!response || !response.data || response.data.locked !== false) {
    console.log('Something may have gone wrong...');
    process.exit(1);
  }
}

module.exports = { sendData };
