export interface GitReporter {
  getTargetBranch(sourceBranch: string): Promise<string | null>;
}
