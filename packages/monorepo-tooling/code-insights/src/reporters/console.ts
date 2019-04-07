import chalk from 'chalk';
import { InsightsReport, Severity } from '../reports/insights-report';
import { InsightsReporter } from './insights-reporter';

export default class ConsoleReporter implements InsightsReporter {
  name = 'Console reporter';
  async publishInsightsReport(insightsReport: InsightsReport) {
    if (insightsReport.annotations.length > 0) {
      console.log(`Current branch introduces the following extra duplicates:`);

      insightsReport.annotations.forEach(
        ({ message, path, line, severity }) => {
          const color = severity === Severity.HIGH ? chalk.red : chalk.yellow;
          console.log(color(`${chalk.bold(`${path}:${line}`)}:  ${message}`));
        },
      );
    }
  }
}
