import chalk from 'chalk';
import crypto from 'crypto';
import envWithGuard from '../../util/env-with-guard';
import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import getDuplicateDependenciesReport from './get-duplicate-dependencies-report';

const { Bitbucket } = require('./bitbucket');

const REPORT_KEY = 'jira.frontend.duplicates';

const message = (annotationCount: number) =>
  `This report interprets the yarn lock file, to tell you if there are any duplicate dependencies introduced by your PR.
    Duplicate dependencies are marked as high severity, dev dependencies as low severity
    ${
      annotationCount > 0
        ? `There are ${annotationCount} new duplicate dependencies introduced in this PR 😢`
        : `Good job! No new duplicate dependencies are introduced in this PR 😃`
    }
    `;

const reportTemplate = annotationCount => ({
  data: [],
  details: message(annotationCount),
  title: 'Duplicates report',
  vendor: 'Jira Frontend',
  logoUrl:
    'https://usagetracker.us-east-1.staging.atl-paas.net/tracker/jfp-small.png?e=duplicates-report',
  result: annotationCount === 0 ? 'PASS' : 'FAIL',
});

function getTargetBranchPackageJSONResolver(targetBranch) {
  return () => loadFileFromGitHistory(targetBranch, 'package.json');
}

function getTargetBranchYarnLockResolver(targetBranch) {
  return () => loadFileFromGitHistory(targetBranch, 'yarn.lock');
}

async function getRegressedDependencies(sourceBranch, targetBranch) {
  const [currentBranch, masterDuplicatesReport] = await Promise.all([
    getDuplicateDependenciesReport({ returnAllDependencyCounts: true }),
    getDuplicateDependenciesReport({
      returnAllDependencyCounts: true,
      packageJSONResolver: getTargetBranchPackageJSONResolver(targetBranch),
      yarnLockResolver: getTargetBranchYarnLockResolver(targetBranch),
    }),
  ]);

  const regressedDependencies = currentBranch
    .map(branchDependencyInfo => [
      masterDuplicatesReport.find(
        ({ name }) => branchDependencyInfo.name === name,
      ),
      branchDependencyInfo,
    ])
    .filter(([masterDependencyInfo, branchDependencyInfo]) => {
      const existingDependencyWithNewDupes =
        masterDependencyInfo &&
        branchDependencyInfo.versions.length >
          masterDependencyInfo.versions.length;

      const newDependencyDupedAlready =
        !masterDependencyInfo && branchDependencyInfo.versions.length > 1;

      return existingDependencyWithNewDupes || newDependencyDupedAlready;
    })
    .map(([masterDependencyInfo, branchDependencyInfo]) => {
      if (!masterDependencyInfo) {
        return {
          ...branchDependencyInfo,
          newVersions: branchDependencyInfo.versions,
        };
      }

      return {
        ...branchDependencyInfo,
        newVersions: branchDependencyInfo.versions.filter(
          version => !masterDependencyInfo.versions.includes(version),
        ),
      };
    });

  if (regressedDependencies.length > 0) {
    console.log(
      `Branch ${chalk.green(
        sourceBranch,
      )} introduces the following extra duplicates:`,
    );

    regressedDependencies.forEach(({ newVersions, name }) => {
      const plural = newVersions.length > 1 ? 's' : '';
      console.log(
        `${chalk.bold(name)}: ${chalk.red(
          newVersions.length,
        )} extra duplicate${plural} version${plural}: ${chalk.red(
          newVersions.join(', '),
        )}`,
      );
    });
  }

  return regressedDependencies;
}

async function publishInsightsReport(regressedDependencies, bitbucket) {
  // add base report
  const totalNewDuplicatesCount = regressedDependencies.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.newVersions.length,
    0,
  );

  await bitbucket.publishInsightsReport(
    REPORT_KEY,
    reportTemplate(totalNewDuplicatesCount),
  );

  const annotations = regressedDependencies.map(
    ({ name, newVersions, isDevDependency }) => {
      const hash = crypto.createHash('sha256');
      hash.update(name, 'utf8');

      return {
        externalId: `risk-${hash.digest('hex')}`,
        message: `${
          newVersions.length
        } extra versions of ${name} are introduced in this change`,
        path: 'yarn.lock',
        line: 0, // file level annotation
        severity: isDevDependency ? 'LOW' : 'HIGH',
      };
    },
  );

  if (annotations.length > 0) {
    await bitbucket.publishInsightAnnotations(REPORT_KEY, annotations);
  }
}

async function main(sourceBranch, gitUrl, token, commit) {
  const bitbucket = new Bitbucket(gitUrl, token, commit);
  const targetBranch =
    (await bitbucket.getTargetBranch(sourceBranch)) || 'master';

  const regressedDependencies = await getRegressedDependencies(
    sourceBranch,
    targetBranch,
  );

  publishInsightsReport(regressedDependencies, bitbucket);
}

interface Reporter {
  sendReport(): boolean;
  options: Object;
}

interface ReportOptions {
  reporters: Array<Reporter>;
}

module.exports = async function DuplicatesReport() {};

const sourceBranch = envWithGuard('SOURCE_BRANCH');
const commit = envWithGuard('COMMIT');
const token = envWithGuard('BITBUCKET_TOKEN');
const gitUrl = envWithGuard('REPO_GIT_URL');

main(sourceBranch, gitUrl, token, commit).catch(err => {
  // catch errors but don't fail the build
  console.error(`Failed to publish duplicate dependencies report`);
  console.error(err);
});
