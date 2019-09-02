const fs = require('fs');
const path = require('path');
const npmRun = require('npm-run');
const chalk = require('chalk').default;
const axios = require('axios');

const masterStatsFolder = createDir('./.masterBundleSize');
const currentStatsFolder = createDir('./.currentBundleSize');

const BITBUCKET_COMMIT = process.env.BITBUCKET_COMMIT;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = 'atlaskit-artefacts';
const BUCKET_REGION = 'ap-southeast-2';

function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (err) {
    if ((err.code = 'EEXIST')) {
      return dir;
    } else {
      console.log(err);
      process.exit(0);
    }
  }
  return dir;
}

function isAWSAccessible() {
  if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !BITBUCKET_COMMIT) {
    console.error(
      chalk.red(
        'AWS_ACCESS_KEY, AWS_SECRET_KEY or BITBUCKET_COMMIT are missing',
      ),
    );
    console.error(
      chalk.red('These env variables need to be set to be able to s3'),
    );
    return false;
  }
  return true;
}

/**
 * This function downloads files from S3 and create ratchet file into a given download location.
 * This does not use S3 commands instead uses http get to fetch ratchet file from S3.
 * This is designed to enable local dev loop without AWS credentials to access data on S3.
 **/
async function downloadFromS3ForLocal(downloadToFolder, branch, package) {
  const ratchetFile = `${package}-bundle-size-ratchet.json`;
  const output = `${downloadToFolder}/${ratchetFile}`;
  const rachetFileUrl = `http://s3-${BUCKET_REGION}.amazonaws.com/${BUCKET_NAME}/${branch}/bundleSize/${ratchetFile}`;
  try {
    const response = await axios({
      url: rachetFileUrl,
      method: 'get',
    });
    fs.writeFileSync(output, JSON.stringify(response.data), 'utf-8');
  } catch (err) {
    if (response.status === 404) {
      console.error(
        chalk.red(`Could not find file ${ratchetFile} on s3, it is likely that you are adding a new package to the repository.
      Please consult the README.md in the @atlaskit/measure folder on how to add a new package on s3.`),
      );
      process.exit(0);
    } else {
      console.error(chalk.red(`${err}`));
      process.exit(0);
    }
  }
}

function downloadFromS3(downloadToFolder, branch, package) {
  if (!isAWSAccessible()) {
    process.exit(1);
  }

  const ratchetFile = `${package}-bundle-size-ratchet.json`;
  const bucketPath = `s3://${BUCKET_NAME}/${branch}/bundleSize/${ratchetFile}`;

  console.log('bucket', bucketPath);
  try {
    npmRun.sync(
      `s3-cli --region="${BUCKET_REGION}" get ${bucketPath} ${downloadToFolder}/${ratchetFile}`,
    );
  } catch (err) {
    if (response.status === 404) {
      console.error(
        chalk.red(`Could not find file ${ratchetFile} on s3, it is likely that you are adding a new package to the repository.
        Please consult the README.md in the @atlaskit/measure folder on how to add a new package on s3.`),
      );
      process.exit(0);
    } else {
      console.error(chalk.red(`${err}`));
      process.exit(0);
    }
  }
}

function uploadToS3(pathToFile, branch) {
  if (!isAWSAccessible()) {
    process.exit(1);
  }

  if (!fs.accessSync(path.resolve(pathToFile))) {
    console.error(
      chalk.red(`Could not find file: ${pathToFile} from ${process.cwd()}`),
    );
  }

  const fileName = path.basename(pathToFile);
  const bucketPath = `s3://${BUCKET_NAME}/${branch}/bundleSize/${fileName}`;

  npmRun.sync(
    `s3-cli --region="${BUCKET_REGION}" put ${pathToFile} ${bucketPath}`,
  );

  const publicUrl = `s3-${BUCKET_REGION}.amazonaws.com/${BUCKET_NAME}/${branch}/bundleSize/${fileName}`;
  console.log(chalk.green('Successfully published to', publicUrl));
}

module.exports = {
  currentStatsFolder,
  downloadFromS3,
  downloadFromS3ForLocal,
  masterStatsFolder,
  uploadToS3,
};
