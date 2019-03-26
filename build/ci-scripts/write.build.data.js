/* Script to send write data per build */
const fs = require('fs');
const path = require('path');
const util = require('util');

const getPipelinesBuildData = require('../utils/getBuildData')
  .getPipelinesBuildData;

const outputFilePath = path.join(process.cwd(), '.build-data', 'data.json');

function writeFile(filePath, fileContents) {
  return util.promisify(cb => fs.writeFile(filePath, fileContents, cb))();
}

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER;
    console.log('buildId :', buildId);
    console.log('buildStatus :', process.env.BITBUCKET_EXIT_CODE);
    const buildData = await getPipelinesBuildData(
      'atlassian',
      'atlaskit-mk-2',
      buildId,
    );

    await fs.writeFile(outputFilePath, JSON.stringify(buildData), function(
      err,
    ) {
      if (err) throw err;
      console.log('Your build data has been saved!');
    });
  } catch (err) {
    console.error(`You face some issues while writing data: ${err}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
