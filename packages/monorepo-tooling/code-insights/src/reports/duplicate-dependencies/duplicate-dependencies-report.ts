import loadFileFromGitHistory from '../../util/load-file-from-git-history';
import getDuplicateDependenciesReport, {
  DuplicateDependencyReportEntry,
} from './get-duplicate-dependencies-report';
import {
  InsightsReportResults,
  InsightsReport,
  Severity,
} from '../insights-report';

const message = (annotationCount: number) =>
  `This report interprets the yarn lock file, to tell you if there are any duplicate dependencies introduced by your PR.
    Duplicate dependencies are marked as high severity, dev dependencies as low severity
    ${
      annotationCount > 0
        ? `There are ${annotationCount} new duplicate dependencies introduced in this PR 😢`
        : `Good job! No new duplicate dependencies are introduced in this PR 😃`
    }
    `;

function getTargetBranchPackageJSONResolver(targetBranch: string) {
  return () => loadFileFromGitHistory(targetBranch, 'package.json');
}

function getTargetBranchYarnLockResolver(targetBranch: string) {
  return () => loadFileFromGitHistory(targetBranch, 'yarn.lock');
}

type RegressedDependencies = DuplicateDependencyReportEntry & {
  newVersions: string[];
};

export type RegressedDependenciesReport = RegressedDependencies[];

async function getRegressedDependencies(
  targetBranch: string,
): Promise<RegressedDependenciesReport> {
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
          version => !masterDependencyInfo.versions.includes(version),
        ),
      };
    });

  return regressedDependencies;
}

export default async function duplicateDependenciesReport(
  targetBranch: string,
): Promise<InsightsReport> {
  const regressedDependencies = await getRegressedDependencies(targetBranch);

  // add base report
  const totalNewDuplicatesCount = regressedDependencies.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.newVersions.length,
    0,
  );

  const result: InsightsReport = {
    details: message(totalNewDuplicatesCount),
    status:
      totalNewDuplicatesCount > 0
        ? InsightsReportResults.FAIL
        : InsightsReportResults.PASS,
    totalErrors: totalNewDuplicatesCount,
    annotations: regressedDependencies.map(
      ({ newVersions, name, directVersion, isDevDependency }) => ({
        message: `${
          newVersions.length
        } extra versions of ${name} are introduced in this change (${newVersions.join(
          ',',
        )})`,
        path: 'yarn.lock',
        line: 0, // file level annotation
        severity:
          !directVersion || isDevDependency ? Severity.LOW : Severity.HIGH,
      }),
    ),
  };

  return result;
}
