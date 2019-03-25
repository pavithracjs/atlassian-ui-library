// @flow
'use strict';
/*
 * Utilities helper to send the data to Datadog.
 */
const StatsD = require('hot-shots');

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

function sendData(payload /*: IBuildEventProperties*/) {
  const client = new StatsD({
    // TODO: when it is working in dev, we need to target production.
    host: 'statsd.ap-southeast-2.dev.paas-inf.net',
    port: 8125,
    errorHandler(error /*: Error*/) {
      console.log('Socket errors caught here: ', error);
    },
    globalTags: { env: process.env.NODE_ENV || 'Production' },
  });

  client.event(
    'atlaskit_build_pipelines_data',
    'The event related to pipelines data for Atlaskit',
  );

  // Create increment metrics per build type: Default, Master, Landkid.
  client.increment('build_count', { build_type: payload.build_type });

  // Whenever there will be a build error, it will emit an event and increment a counter.
  if (payload.build_status === 'FAILED') {
    client.event('atlaskit_build_error', payload.build_name);
    client.increment('build_error', { build_type: payload.build_type });
  }

  client.gauge('build_time', payload.build_time, 1, {
    build_type: payload.build_type,
  });
  client.gauge('build_number_steps', payload.build_number_steps, {
    build_type: payload.build_type,
  });

  for (const step of payload.build_steps) {
    if (step) {
      client.gauge('build_time', step.step_duration, {
        build_type: payload.build_type,
        step_name: step.step_name,
        step_status: step.step_status,
      });
      // Whenever there will be a step error, it will emit an event and increment a counter.
      if (step.step_status === 'FAILED') {
        client.event('atlaskit_step_error', step.step_name);
        client.increment('build_error', {
          build_type: payload.build_type,
          step_name: step.step_name,
        });
      }
    }
  }

  client.close(function(err /*: Error*/) {
    if (err) {
      console.log('The close did not work quite right: ', err);
    } else {
      console.log('The build data has been correctly sent!');
    }
  });
}

module.exports = { sendData };
