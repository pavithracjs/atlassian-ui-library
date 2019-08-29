//@flow
'use strict';
/*
 * Utilities helper to get build data.
 */
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const stripAnsi = require('strip-ansi');

// started_on and duration_in_seconds are added to the object only for the logic below they are not sent to the service.
/*::
type IStepsDataType = {
  step_name: string,
  step_status: string,
  step_duration: number,
  started_on: string,
  duration_in_seconds: number,
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
/* This function strip logs from the pipeline based on the last command that did not fail. */
function stripLogs(logs /*: string */, command /*: string */) {
  if (logs.indexOf(command) >= 0) {
    // The logs are displayed with colors and style, using stripAnsi() will clean its.
    return stripAnsi(logs.split(command)[1]);
  }
}
/* This function computes build time if build.duration_in_seconds returns 0, it is often applicable for 1 step build.
 * The Bitbucket computation is simple, they sum the longest step time with the shortest one.
 */
async function computeBuildTime(
  stepsData /*: Array<IStepsDataType>*/,
) /*: Promise<number> */ {
  let buildDuration;
  const stepDurationArray = stepsData
    .filter(step => step.step_duration)
    .map(step => step.step_duration);
  // When a build has 1 step, we can't apply this function, we take the only available value.
  if (stepDurationArray.length === 1) {
    buildDuration = stepDurationArray[0];
  } else {
    // The minimum step duration cannot be 0 and it is in avg 30s in AK.
    const minStepDuration =
      Math.min.apply(null, stepDurationArray) === 0
        ? 30
        : Math.min.apply(null, stepDurationArray);
    buildDuration = Math.max.apply(null, stepDurationArray) + minStepDuration;
  }
  return buildDuration;
}

/* This function returns the build duration time. */
async function getBuildTime(
  buildTime /*:? number */,
  stepsData /*: Array<IStepsDataType>*/,
) {
  const computedBuildTime = await computeBuildTime(stepsData);
  if (buildTime) {
    if (computedBuildTime > buildTime) {
      return computedBuildTime;
    } else {
      return buildTime;
    }
  } else {
    return computedBuildTime;
  }
}

/* This function computes step time if step.duration_in_seconds returns undefined or 0.
 * The function returns the difference between the current time and when the step started,
 * It is more likely applicable for 1 step build.
 */
async function computeStepTimes(
  stepStartTime /*: string */,
) /*: Promise<number> */ {
  const currentTime = Date.now();
  // It returns the time in ms, we want in seconds.
  return (parseInt(currentTime) - Date.parse(stepStartTime)) / 1000;
}

/* This function returns the step duration time. */
async function getStepTime(
  stepObject /*: IStepsDataType */,
  stepsLength /*: number */,
) {
  let stepDuration;
  if (stepObject && stepObject.duration_in_seconds > 0 && stepsLength > 1) {
    stepDuration = stepObject.duration_in_seconds;
  } else {
    // We need to do a computation if the step.duration_in_seconds is not yet available and it is a 1 step build.
    stepDuration = computeStepTimes(stepObject.started_on);
  }
  return stepDuration;
}

/* This function returns the payload for the build / pipelines. */
async function getPipelinesBuildEvents(
  buildId /*: string */,
) /*: Promise<IBuildEventProperties> */ {
  let payload /*: $Shape<IBuildEventProperties> */ = {};
  const apiEndpoint = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}`;
  try {
    const res = await axios.get(apiEndpoint);
    const build = res.data;
    const stepsData = await getStepsEvents(
      buildId,
      build.target.selector.pattern || build.target.selector.type,
    );
    const buildStatus = process.env.BITBUCKET_EXIT_CODE
      ? process.env.BITBUCKET_EXIT_CODE === '0'
        ? 'SUCCESSFUL'
        : 'FAILED'
      : build.state.result.name;
    if (stepsData) {
      const buildTime = await getBuildTime(
        build.duration_in_seconds,
        stepsData,
      );
      payload = {
        build_number: buildId,
        build_status: buildStatus,
        build_time: buildTime,
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

/* This function returns the payload for the build steps.*/
async function getStepsEvents(buildId /*: string*/, buildType /*:? string */) {
  const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/`;
  try {
    const resp = await axios.get(url);
    return Promise.all(
      resp.data.values.map(async step => {
        // We don't have control of the last step, it is a edge case.
        // In the after_script, the last step is still 'IN-PROGRESS' but the result of the last step does not matter.
        // We use the process.env.BITBUCKET_EXIT_CODE to determine the status of the pipeline.
        if (step && step.state) {
          const stepStatus = process.env.BITBUCKET_EXIT_CODE
            ? process.env.BITBUCKET_EXIT_CODE === '0'
              ? 'SUCCESSFUL'
              : 'FAILED'
            : step.state.result.name;
          const stepTime = await getStepTime(step, resp.data.values.length);
          return {
            step_duration: stepTime,
            step_name: step.name || buildType, // on Master, there is no step name.
            step_status: stepStatus,
          };
        }
      }),
    );
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

/* This function returns a payload depending on the build type.*/
const createPayloadPerBuildType = (
  step_name /*: string */,
  build_type /*: string */,
  build_name /*: string */,
) => {
  return {
    step_name,
    build_type,
    build_name,
  };
};

/* This function identifies the step currently running and build a partial payload based on the build type.*/
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
    // process.env.BITBUCKET_PARALLEL_STEP returns zero-based index of the current step in the group, for example: 0, 1, 2, … - only for parallel step.
    // This will return the actual step where the build is currently running.
    // Note: indentedJson.pipelines.<branch_name> returns an array.
    if (buildType === 'default') {
      return createPayloadPerBuildType(
        indentedJson.pipelines.default[0].parallel[
          process.env.BITBUCKET_PARALLEL_STEP
        ].step.name,
        'default',
        res.data.target.ref_name ||
          res.data.target.selector.pattern ||
          res.data.target.selector.type,
      );
    }
    if (buildType === 'landkid') {
      return createPayloadPerBuildType(
        indentedJson.pipelines.custom['landkid'][0].parallel[
          process.env.BITBUCKET_PARALLEL_STEP
        ].step.name,
        'custom',
        'landkid',
      );
    }
    if (buildType === 'run-full-suite') {
      return createPayloadPerBuildType(
        indentedJson.pipelines.custom['run-full-suite'][0].parallel[
          process.env.BITBUCKET_PARALLEL_STEP
        ].step.name,
        'custom',
        'run-full-suite',
      );
    }
  } catch (e) {
    console.log(e);
  }
}

/* This function the final step payload when a build with parallel step is running in Bitbucket.*/
async function getStepEvents(buildId /*: string*/) {
  const stepsUrl = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/`;
  try {
    const stepPayload = await getStepNamePerBuildType(buildId);
    const res = await axios.get(stepsUrl);
    // Filter returns an array and we need the first value.
    if (stepPayload) {
      const stepObject = res.data.values.filter(
        step => step.name === stepPayload.step_name,
      )[0];
      const buildStatus = process.env.BITBUCKET_EXIT_CODE
        ? process.env.BITBUCKET_EXIT_CODE === '0'
          ? 'SUCCESSFUL'
          : 'FAILED'
        : stepObject.state.result.name;
      const stepTime = await getStepTime(stepObject, stepObject.length);
      const stepLogs = await getStepFailedLogs(
        buildId,
        stepObject.uuid,
        buildStatus,
        stepObject.script_commands[stepObject.script_commands.length - 1]
          .command,
      );
      return {
        build_status: buildStatus,
        build_name: stepPayload.build_name,
        build_type: stepPayload.build_type,
        build_steps: [
          {
            step_duration: stepTime,
            step_status: buildStatus,
            step_name: stepObject.name || stepPayload.build_type, // if there is one step and no step name, we can refer to the build type.
            step_logs: stepLogs,
          },
        ],
      };
    }
  } catch (err) {
    console.error(err.toString());
    process.exit(1);
  }
}

async function getStepFailedLogs(
  buildId /*: string */,
  stepUuid /*: string */,
  status /*: string */,
  command /*: string */,
) {
  let logs = '';
  if (status === 'FAILED' && buildId && command) {
    const url = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines/${buildId}/steps/${stepUuid}/log`;
    try {
      const resp = await axios.get(url);
      logs = stripLogs(resp.data, command);
    } catch (err) {
      // Sometimes some logs are not found,
      logs = `${err}`;
    }
  }
  return logs;
}

module.exports = { getPipelinesBuildEvents, getStepEvents };
