/* Script to send step failure events data to the fabric build stats service. */
/* The repository is available there: https://bitbucket.org/atlassian/fabric-build-stats-service/.
/* The service is available in dev: https://fabric-build-stats-service.ap-southeast-2.dev.public.atl-paas.net/.
/* The production url will be available soon.*/

const getStepEvents = require('./buildEventsUtils/getBuildEvents')
  .getStepEvents;

const getStepName = require('./buildEventsUtils/getBuildEvents')
  .getBuildStepName;

const sendBuildEventsPayload = require('./buildEventsUtils/sendBuildEventsPayload')
  .sendBuildEventsPayload;

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER;
    await getStepName();
    // const stepId = '';
    // const stepEvents = await getStepEvents(buildId, );
    // await sendBuildEventsPayload(buildEvents);
  } catch (err) {
    console.error(`You face some issues while sending data: ${err.message}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
