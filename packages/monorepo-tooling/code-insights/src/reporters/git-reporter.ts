import { InsightsReporter } from './insights-reporter';

export interface GitReporter extends InsightsReporter {
  getTargetBranch(sourceBranch: string): Promise<string | null>;
}
