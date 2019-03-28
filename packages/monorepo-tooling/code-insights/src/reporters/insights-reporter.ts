import { InsightsReport } from '../reports/insights-report';

export interface InsightsReporter {
  name: string;
  publishInsightsReport: (insightsReport: InsightsReport) => Promise<void>;
}
