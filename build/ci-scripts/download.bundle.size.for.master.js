const fs = require('fs');
const path = require('path');
const bolt = require('bolt');
const npmRun = require('npm-run');

const BITBUCKET_COMMIT = process.env.BITBUCKET_COMMIT;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = 'atlaskit-artefacts';
const BUCKET_REGION = 'ap-southeast-2';

if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !BITBUCKET_COMMIT) {
  console.error(
    'AWS_ACCESS_KEY, AWS_SECRET_KEY or BITBUCKET_COMMIT are missing',
  );
  console.error('These env variables need to be set to be able to s3');
  process.exit(1);
}

(async () => {
  const project = await bolt.getProject();
  const projectDir = project.dir;
  const workspaces = await bolt.getWorkspaces();
  // We'll add the relativeDir's to these so we have more information to work from later
  const packages = workspaces
    .filter(ws => ws.dir.includes('/packages/'))
    .map(
      pkg => `${pkg.name.replace('@atlaskit/', '')}-bundle-size-ratchet.json`,
    );

  // TODO: Changes pkgs is not returning all changed pkgs
  // console.log(process.env.CHANGED_PACKAGES);
  // const changedPkg = process.env.CHANGED_PACKAGES
  //   ? JSON.parse(process.env.CHANGED_PACKAGES).map(
  //       pkg => `${pkg.split('/').reverse()[0]}-bundle-size-ratchet.json`,
  //     )
  //   : packages;

  packages.forEach(ratchetFile => {
    const bucketPath = `s3://${BUCKET_NAME}/master/bundleSize/${ratchetFile}`;

    npmRun.sync(
      `s3-cli --region="${BUCKET_REGION}" get ${bucketPath} ${ratchetFile}`,
    );
  });
})();
