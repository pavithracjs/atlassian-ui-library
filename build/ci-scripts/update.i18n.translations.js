const fetch = require('node-fetch');
const path = require('path');
const spawn = require('projector-spawn');
const changeset = require('../utils/changeset');
const git = require('../utils/git');

/**
 * `packages` defines the packages to be updated and set the reviewers for the changes.
 * packagePath: Path to the package relative to repo root.
 * maintainers: List of reviewer's (by BitBucket username) to be added to the pull request.
 * targetBranch (optional): Destination branch for PR. If omitted, default is 'master'.
 */
const packages = [
  {
    packagePath: './packages/editor/editor-core',
    maintainers: ['samuellewis', 'nathanflew'],
    targetBranch: 'editor-next-release',
  },
];

const APP_USER = process.env.i18n_PR_BOT_USERNAME || '';
const APP_KEY = process.env.i18n_PR_BOT_ACCESS || '';

const push = async ({ packagePath }) => {
  try {
    await spawn('yarn', ['--cwd', packagePath, 'i18n:push']);
  } catch (err) {
    console.error(
      `Failed to push to translation service for ${packagePath}: ${err}`,
    );
    process.exit(1);
  }
};

const pull = async ({ packagePath, maintainers, targetBranch = 'master' }) => {
  const packageName = packagePath.split('/').pop();
  const today = new Date().toISOString().slice(0, 10);
  const branchName = `${packageName}-translation-update-${today}`;
  const message = `Update i18n translations for ${packageName}`;

  try {
    // Create a branch from master
    await git.checkout(targetBranch);
    await git.branch(branchName);

    // Pull translations
    await spawn('yarn', ['--cwd', packagePath, 'i18n:pull']);
  } catch (err) {
    console.error(`Failed to pull translations for ${packagePath}: ${err}`);
    process.exit(1);
  }

  // Check for changes, else no pull request needed
  try {
    const changes = await spawn('git', ['diff', '--name-only']);
    if (!changes.stdout || changes.stdout === '') {
      // No changes, don't create pull request
      return;
    }
  } catch (err) {
    console.error(
      `Failed to execute git command 'git diff --name-only' for ${packagePath}: ${err}`,
    );
    process.exit(1);
  }

  try {
    // Add content and create pull request
    await changeset.createChangeset(
      [{ name: `@atlaskit/${packageName}`, type: 'patch' }],
      message,
    );
    await git.add(path.join(process.cwd(), '.changeset'));
    await git.add(packagePath);
    await git.commit(message);
    await git.push(['--set-upstream', 'origin', branchName]);
  } catch (err) {
    console.error(
      `Failed to push branch ${branchName} for ${packagePath}: ${err}`,
    );
    process.exit(1);
  }

  await createPullRequest(branchName, maintainers, message, targetBranch);
};

async function createPullRequest(
  branchName,
  reviewers,
  title,
  targetBranch = 'master',
) {
  if (APP_USER === '' || APP_KEY === '') {
    console.error(
      'Failed to create pull request: Could not find BitBucket auth keys',
    );
    process.exit(1);
  }

  const data = {
    title,
    description: '',
    source: {
      branch: { name: branchName },
    },
    destination: {
      branch: { name: targetBranch },
    },
    reviewers: reviewers.map(username => {
      return { username };
    }),

    close_source_branch: true,
  };

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
    console.error(
      `Failed to create pull request for branch ${targetBranch}: ${err}`,
    );
    process.exit(1);
  });
}

(async () => {
  const operation = {
    push: push,
    pull: pull,
  }[process.argv[2]];

  if (!operation) {
    console.error('Invalid argument. Use `push` or `pull`');
    process.exit(1);
  }

  packages.map(operation);
})();
