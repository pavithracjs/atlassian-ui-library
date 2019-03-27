import chalk from 'chalk';
import {
  InsightsReport,
  InsightsReportResults,
} from '../reports/insights-report';

export default (insightsReport: InsightsReport) => {
  if (insightsReport.status === InsightsReportResults.FAIL) {
    console.log(`Current branch introduces the following extra duplicates:`);

    insightsReport.annotations.forEach(({ message, path, line }) => {
      console.log(chalk.red(`${chalk.bold(`${path}:${line}`)}:  ${message}`));
    });
  }
};
