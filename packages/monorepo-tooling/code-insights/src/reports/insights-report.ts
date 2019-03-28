export enum InsightsReportResults {
  PASS = 'PASS',
  FAIL = 'FAIL',
}
export enum Severity {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export interface InsightsReport {
  details: string;
  status: InsightsReportResults;
  totalErrors: number;
  annotations: Array<InsightsReportAnnotation>;
}

export type InsightsReportAnnotation = {
  message: string;
  path: string;
  line: number;
  severity: Severity;
};
