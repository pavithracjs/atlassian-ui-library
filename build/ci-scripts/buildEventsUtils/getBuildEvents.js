//@flow
'use strict';
/*
 * Utilities helper to get build data.
 */
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

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

async function getBuildStepName() {
  try {
    const config = yaml.safeLoad(
      fs.readFileSync('./../../../bitbucket-pipelines.yml', 'utf8'),
    );
    const indentedJson = JSON.stringify(config, null, 4);
    console.log(indentedJson);
  } catch (e) {
    console.log(e);
  }
}

async function getPipelinesBuildEvents(
  buildId /*: string */,
) /*: Promise<IBuildEventProperties> */ {
  let payload /*: $Shape<IBuildEventProperties> */ = {};
  const apiEndpoint = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}`;
  try {
    const res = await axios.get(apiEndpoint);
    const build = res.data;
    const stepsData = await getStepsEvents(buildId);
    const buildStatus = process.env.BITBUCKET_EXIT_CODE
      ? process.env.BITBUCKET_EXIT_CODE === '0'
        ? 'SUCCESSFUL'
        : 'FAILED'
      : build.state.result.name;
    if (stepsData) {
      payload = {
        build_number: buildId,
        build_status: buildStatus,
        build_time: build.duration_in_seconds,
        // build_type categorises the type of the build that runs:
        // - default
        // - master
        // - custom
        // Most of the time, build.target.selector.pattern === build.target.ref_name.
        // It depends on what is available for the particular build.
        build_type: build.target.selector.pattern || 'default',
        // build_name refers to the branch name that runs this build.
        // In case, the build_name is undefined, we will refer it as its type.
        build_name: build.target.ref_name || build.target.selector.pattern,
        build_number_steps: stepsData.length,
        build_steps: stepsData,
      };
    }
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
  return payload;
}

async function getStepsEvents(buildId /*: string*/) {
  const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/`;
  try {
    const resp = await axios.get(url);
    return Promise.all(
      resp.data.values.map(async step => {
        // We don't have control of the last step, it is a edge case.
        // In the after_script, the last step is still 'IN-PROGRESS' but the result of the last step does not matter.
        // We use the process.env.BITBUCKET_EXIT_CODE to determine the status of the pipeline.
        if (step && step.state.result) {
          const stepStatus =
            step.state.result.name === 'IN-PROGRESS'
              ? 'SUCCESSFUL'
              : step.state.result.name;
          return {
            step_duration: step.duration_in_seconds,
            step_name: step.name || 'master', // on Master, there is no step name.
            step_status: step.state.result.name,
          };
        }
      }),
    );
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

async function getStepId(buildId /*: string*/, stepName /*: string*/) {
  const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/`;
  try {
    const resp = await axios.get(url);
    const stepFound = resp.data.values.filter(step => step.name === stepName);
    return stepFound.uuid;
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

async function getStepEvents(buildId /*: string*/, stepName /*: string*/) {
  try {
    const stepId = await getStepId(buildId, stepName);
    const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/${stepId}`;

    const resp = await axios.get(url);
    const step = resp.data;
    const buildStatus = process.env.BITBUCKET_EXIT_CODE;
    process.env.BITBUCKET_EXIT_CODE === '0' ? 'SUCCESSFUL' : 'FAILED';
    return {
      step_status: buildStatus,
      step_name: step.name || 'master', // on Master, there is no step name,
    };
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

module.exports = { getPipelinesBuildEvents, getStepEvents, getBuildStepName };
