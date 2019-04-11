/* Script to send build data to the fabric build stats service. */
/* The repository is available there: https://bitbucket.org/atlassian/fabric-build-stats-service/.
/* The service is available in dev: https://fabric-build-stats-service.ap-southeast-2.dev.public.atl-paas.net/.
/* The production url will be available soon.*/

const getPipelinesBuildEvents = require('./buildEventsUtils/getBuildEvents')
  .getPipelinesBuildEvents;
const sendBuildEventsPayload = require('./buildEvents/sendPayload')
  .sendBuildEventsPayload;

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER;
    const buildEvents = await getPipelinesBuildEvents(
      'atlassian',
      'atlaskit-mk-2',
      buildId,
    );
    await sendBuildEventsPayload(buildEvents);
  } catch (err) {
    console.error(`You face some issues while sending data: ${err.message}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
