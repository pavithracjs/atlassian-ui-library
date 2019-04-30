//@flow
'use strict';
/*
 * Utilities helper to get build data.
 */
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

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
        build_type:
          build.target.selector.pattern ||
          build.target.selector.type ||
          'default',
        // build_name refers to the branch name that runs this build.
        // In case, the build_name is undefined, we will refer it as its type.
        build_name:
          build.target.ref_name ||
          build.target.selector.pattern ||
          build.target.selector.type,
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

async function getStepNamePerBuildType(buildId /*: string */) {
  try {
    const config = yaml.safeLoad(
      fs.readFileSync('bitbucket-pipelines.yml', 'utf8'),
    );
    const indentedJson = JSON.parse(JSON.stringify(config, null, 4));
    const apiEndpoint = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}`;
    const res = await axios.get(apiEndpoint);
    const buildType = res.data.target.selector.type || 'default';
    // Only the 3 types of build below will have parallel steps.
    // process.env.BITBUCKET_PARALLEL_STEP retruns zero-based index of the current step in the group, for example: 0, 1, 2, … - only for parallel step.
    // This will return the actual step where the build is currently running.
    // Note: indentedJson.pipelines.<branch_name> returns an array.
    if (buildType === 'default') {
      return {
        step_name:
          indentedJson.pipelines.default[0].parallel[
            process.env.BITBUCKET_PARALLEL_STEP
          ].step.name,
        build_type: 'default',
        build_name:
          res.data.target.ref_name ||
          res.data.target.selector.pattern ||
          res.data.target.selector.type,
      };
    }
    if (buildType === 'landkid') {
      return {
        step_name:
          indentedJson.pipelines.custom['landkid'][0].parallel[
            process.env.BITBUCKET_PARALLEL_STEP
          ].step.name,
        build_type: 'custom',
        build_name: 'landkid',
      };
    }
    if (buildType === 'run-full-suite') {
      return {
        step_name:
          indentedJson.pipelines.custom['run-full-suite'][0].parallel[
            process.env.BITBUCKET_PARALLEL_STEP
          ].step.name,
        build_type: 'custom',
        build_name: 'run-full-suite',
      };
    }
  } catch (e) {
    console.log(e);
  }
}
async function getStepEvents(buildId /*: string*/) {
  const stepsUrl = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/`;
  try {
    const stepPayload = await getStepNamePerBuildType(buildId);
    const res = await axios.get(stepsUrl);
    // Filter returns an array and we need the first value.
    if (stepPayload) {
      const stepFound = res.data.values.filter(
        step => step.name === stepPayload.step_name,
      )[0];
      const buildStatus =
        process.env.BITBUCKET_EXIT_CODE === '0' ? 'SUCCESSFUL' : 'FAILED';
      return {
        build_status: buildStatus,
        build_name: stepPayload.build_name,
        build_type: stepPayload.build_type,
        build_steps: [
          {
            step_duration: stepFound.duration_in_seconds,
            step_status: buildStatus,
            step_name: stepFound.name || 'master', // on Master, there is no step name,
          },
        ],
      };
    }
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

module.exports = { getPipelinesBuildEvents, getStepEvents };
