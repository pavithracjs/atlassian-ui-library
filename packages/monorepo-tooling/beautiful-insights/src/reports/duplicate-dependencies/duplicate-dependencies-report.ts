import chalk from 'chalk';
import crypto from 'crypto';
import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import getDuplicateDependenciesReport, {
  DuplicateDependencyReportEntry,
} from './get-duplicate-dependencies-report';
import Bitbucket, {
  CodeInsightsAnnotation,
  Severity,
  CodeInsightsReportResults,
} from '../../reporters/bitbucket-server';

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

const reportTemplate = (annotationCount: number) => ({
  details: message(annotationCount),
  title: 'Duplicates report',
  vendor: 'Jira Frontend',
  logoUrl:
    'https://usagetracker.us-east-1.staging.atl-paas.net/tracker/jfp-small.png?e=duplicates-report', // TODO: Remove Jira specific logo
  result:
    annotationCount === 0
      ? CodeInsightsReportResults.PASS
      : CodeInsightsReportResults.FAIL,
});

function getTargetBranchPackageJSONResolver(targetBranch: string) {
  return () => loadFileFromGitHistory(targetBranch, 'package.json');
}

function getTargetBranchYarnLockResolver(targetBranch: string) {
  return () => loadFileFromGitHistory(targetBranch, 'yarn.lock');
}

type RegressedDependencies = DuplicateDependencyReportEntry & {
  newVersions: string[];
};

async function getRegressedDependencies(
  sourceBranch: string,
  targetBranch: string,
): Promise<RegressedDependencies[]> {
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
        branchDependencyInfo &&
        branchDependencyInfo.versions.length >
          masterDependencyInfo.versions.length;

      const newDependencyDupedAlready =
        !masterDependencyInfo &&
        branchDependencyInfo &&
        branchDependencyInfo.versions.length > 1;

      return existingDependencyWithNewDupes || newDependencyDupedAlready;
    })
    .map(([masterDependencyInfo, branchDependencyInfo]) => {
      if (!branchDependencyInfo) {
        throw new Error(
          "This check is only here to make typescript happy, it's impossible to ever happen...",
        );
      }

      if (!masterDependencyInfo) {
        return {
          ...branchDependencyInfo,
          newVersions: branchDependencyInfo.versions,
        };
      }

      return {
        ...branchDependencyInfo,
        newVersions: branchDependencyInfo.versions.filter(
          version => masterDependencyInfo.versions.indexOf(version) > -1,
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
          newVersions.length.toString(),
        )} extra duplicate${plural} version${plural}: ${chalk.red(
          newVersions.join(', '),
        )}`,
      );
    });
  }

  return regressedDependencies;
}

async function publishInsightsReport(
  regressedDependencies: RegressedDependencies[],
  bitbucket: Bitbucket,
) {
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

  const annotations: CodeInsightsAnnotation[] = regressedDependencies.map(
    ({ name, newVersions, isDevDependency, directVersion }) => {
      const hash = crypto.createHash('sha256');
      hash.update(name, 'utf8');

      return {
        externalId: `risk-${hash.digest('hex')}` + new Date().getTime(),
        message: `${
          newVersions.length
        } extra versions of ${name} are introduced in this change`,
        path: 'yarn.lock',
        line: 0, // file level annotation
        severity:
          directVersion && isDevDependency ? Severity.LOW : Severity.HIGH,
      };
    },
  );

  if (annotations.length > 0) {
    await bitbucket.publishInsightAnnotations(REPORT_KEY, annotations);
  }
}

export default async function duplicateDependenciesReport(
  sourceBranch: string,
  gitUrl: string,
  token: string,
  commit: string,
) {
  const bitbucket = new Bitbucket(gitUrl, token, commit);
  const targetBranch =
    (await bitbucket.getTargetBranch(sourceBranch)) || 'master';

  const regressedDependencies = await getRegressedDependencies(
    sourceBranch,
    targetBranch,
  );

  publishInsightsReport(regressedDependencies, bitbucket);
}
