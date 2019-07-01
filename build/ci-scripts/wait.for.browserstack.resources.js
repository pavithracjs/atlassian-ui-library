const axios = require('axios');
const util = require('util');
/**
 * NOTE: This utility will manage the browserstack build queues.
 * It checks the number of build running in BS and if the number is greater than the X limit, it will retry after Y time.
 * The goal is to prevent Browserstack to be hammered and reduce the number of timeout for users.
 * */
const numberOfTries = process.env.BS_RETRY || 3;
const numberOfParallelSessions = process.env.BS_SESSIONS_ALLOWED || 30; // Depending on the number of tests running, the limit is 90.
const auth = Buffer.from(
  `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_KEY}`,
).toString('base64');

const sleep = util.promisify(setTimeout);

function checkBSParallelSessions() {
  return axios
    .get('https://api.browserstack.com/automate/plan.json', {
      headers: {
        Authorization: 'Basic ' + auth,
      },
    })
    .then(response => {
      const runningParallelSessions = response.data.parallel_sessions_running;
      if (runningParallelSessions > numberOfParallelSessions) {
        return Promise.reject(
          new Error(
            `Browserstack is currently running with ${runningParallelSessions} sessions concurrently, please try again later`,
          ),
        );
      }
    });
}

async function main() {
  for (let i = 0; i < numberOfTries; i++) {
    try {
      await checkBSParallelSessions();
      process.exit(0);
    } catch (e) {
      console.log(e);
      await sleep(10000 * Math.pow(2, i));
    }
  }
  process.exit(1);
}
main();
