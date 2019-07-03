const spawn = require('projector-spawn');
const fetch = require('node-fetch');
const git = require('../utils/git');

const packages = [
  {
    path: './packages/editor/editor-core',
    maintainers: ['samuellewis'],
  },
];

const APP_USER = process.env.i18n_PR_BOT_USERNAME;
const APP_KEY = process.env.i18n_PR_BOT_ACCESS;

const push = async ({ path }) => {
  try {
    console.log('Pushing messages to i18n service for', path);
    await spawn('yarn', ['--cwd', path, 'i18n:push']);
  } catch (err) {
    console.error('Could not push to translation service', err);
    process.exit(1);
  }
};

const pull = async ({ path, maintainers }) => {
  console.log('Pulling translations for', path);

  try {
    await spawn('rm', ['-f', '/opt/atlassian/pipelines/build/.git/index.lock']);
  } catch (err) {
    console.error('Could not remove .git/index', err);
    // process.exit(1);
  }

  const packageName = path.split('/').pop();
  const today = new Date().toISOString().slice(0, 10);
  const branchName = `${packageName}-translation-update-${today}`;

  try {
    // Create a branch from master
    console.log('Checking out master');
    await git.checkout('master');
    console.log('Branching to', branchName);
    await git.branch(branchName);

    // Pull translations
    console.log(`running 'yarn --cwd ${path} i18n:pull'`);
    const pull = await spawn('yarn', ['--cwd', path, 'i18n:pull']);
    console.log('pull result', pull.stdout);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  // Check for changes, else no pull request needed
  try {
    console.log('Getting git diff');
    const changes = await spawn('git', ['diff', '--name-only']);
    if (!changes.stdout.trim()) {
      console.log('No changes found. No pull request needed.');
      return;
    }
  } catch (err) {
    console.error('Failed to check changes: ', err);
    process.exit(1);
  }

  try {
    // Add content and create pull request
    console.log('Adding files at path', path);
    await git.add(path);
    console.log('Committing');
    await git.commit(`Update i18n translations for ${packageName}`);
    // TODO: Add changeset generation. Pending accessible CLI for the existing changeset tool.
    console.log(`git push --set-upstream origin ${branchName}`);
    const push = await git.push(['--set-upstream', 'origin', branchName]);
    if (!push) {
      console.error('Failed to git push');
    }
  } catch (err) {
    console.error('Failed to push branch:', err);
    process.exit(1);
  }

  createPullRequest(branchName, packageName, maintainers);
};

async function createPullRequest(branchName, packageName, maintainers) {
  const data = {
    title: `Update i18n translations for ${packageName}`,
    description: '',
    source: {
      branch: { name: branchName },
    },
    destination: {
      branch: { name: 'master' },
    },
    reviewers: maintainers.map(username => {
      return { username };
    }),

    close_source_branch: true,
  };

  console.log('Creating pull request');
  await fetch(
    'https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pullrequests',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + Buffer.from(APP_USER + ':' + APP_KEY).toString('base64'),
      },
      body: JSON.stringify(data),
    },
  ).catch(err => {
    console.error('Failed to create pull request:', err);
    process.exit(1);
  });
}

(async () => {
  let operation = () => {};
  switch (process.argv[2]) {
    case 'push':
      operation = push;
      break;
    case 'pull':
      operation = pull;
      break;
    default:
      console.error('Invalid argument. Use `push` or `pull`');
      return;
  }

  packages.map(operation);
})();
