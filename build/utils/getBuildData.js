//@flow
'use strict';
/*
 * Utilities helper to get build data.
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

async function getPipelinesBuildData(
  repoOwner /*: string */,
  repoName /*: string */,
  buildId /*: string */,
) /*: Promise<IBuildEventProperties> */ {
  const apiEndpoint = `https://api.bitbucket.org/2.0/repositories/${repoOwner}/${repoName}/pipelines/${buildId}`;
  const res = await axios.get(apiEndpoint);
  const build = res.data;
  let payload /*: $Shape<IBuildEventProperties> */ = {};
  console.log('build', build);
  try {
    const stepsData = await getStepsData(buildId);
    if (
      build.state.result &&
      build.state.result.name !== 'IN-PROGRESS' &&
      stepsData
    ) {
      payload = {
        build_number: buildId,
        build_status: build.state.result.name,
        build_time: build.duration_in_seconds,
        build_type: build.target.selector.pattern || 'default',
        build_name: build.target.ref_name || build.target.selector.pattern, // In case, the build_name is undefined, we will refer it as a type
        build_number_steps: stepsData.length,
        build_steps: stepsData,
      };
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  return payload;
}

async function getStepsData(buildNumber /*: string*/) {
  if (buildNumber) {
    const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildNumber}/steps/`;
    const resp = await axios.get(url);
    return Promise.all(
      resp.data.values.map(async step => {
        if (step.state.result && step.state.result.name !== 'IN-PROGRESS') {
          return {
            step_duration: step.duration_in_seconds,
            step_name: step.name || 'master', // on Master, there is no step name
            step_status: step.state.result.name,
          };
        }
      }),
    );
  }
}

module.exports = { getPipelinesBuildData };
