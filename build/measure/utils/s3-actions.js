const fs = require('fs');
const path = require('path');
const npmRun = require('npm-run');
const chalk = require('chalk').default;

const masterStatsFolder = createDir('./.masterBundleSize');
const currentStatsFolder = createDir('./.currentBundleSize');

const BITBUCKET_COMMIT = process.env.BITBUCKET_COMMIT;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = 'atlaskit-artefacts';
const BUCKET_REGION = 'ap-southeast-2';

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
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

function downloadFromS3(downloadToFolder, branch, package) {
  if (!isAWSAccessible()) {
    process.exit(1);
  }

  const ratchetFile = `${package}-bundle-size-ratchet.json`;
  const bucketPath = `s3://${BUCKET_NAME}/${branch}/bundleSize/${ratchetFile}`;

  console.log('bucket', bucketPath);

  npmRun.sync(
    `s3-cli --region="${BUCKET_REGION}" get ${bucketPath} ${downloadToFolder}/${ratchetFile}`,
  );
}

function uploadToS3(pathToFile, branch) {
  if (!isAWSAccessible()) {
    process.exit(1);
  }

  if (!fs.existsSync(path.resolve(pathToFile))) {
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
  masterStatsFolder,
  uploadToS3,
};
