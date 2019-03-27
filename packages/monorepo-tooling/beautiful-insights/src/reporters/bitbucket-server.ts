import fetch, { Response } from 'node-fetch';
import urlParse from 'url-parse';
import envWithGuard from '../util/env-with-guard';
import {
  InsightsReportResults,
  InsightsReport,
  Severity,
} from '../reports/insights-report';
import crypto from 'crypto';
import { GitReporter } from './git-reporter';

// TODO: Expose this through the CLI
const REPORT_KEY = 'beautiful.insights.duplicates';

type CodeInsightsAnnotation = {
  externalId: string;
  message: string;
  path: string;
  line: number;
  severity: Severity; // TODO: There are probably more?
};

type CodeInsightsReport = {
  data?: object[];
  details: string;
  title: string;
  vendor: string;
  logoUrl: string;
  result: InsightsReportResults;
};

type RequestOptions = {
  method: string;
  headers: {
    Authorization: string;
    'Content-type': 'application/json';
    Accept: 'application/json';
  };
  body?: string;
};
type DisplayId = string;
type PullRequests = {
  fromRef: {
    displayId: DisplayId;
  };
  toRef: {
    displayId: DisplayId;
  };
};

type PullRequestsApiResult = {
  size: number;
  limit: number;
  isLastPage: boolean;
  values: PullRequests[];
  start: number;
  filter?: string;
  nextPageStart: number;
};

export default class BitbucketServerReporter implements GitReporter {
  baseUrl: string;
  project: string;
  repo: string;
  token: string;
  commit: string;

  constructor(gitUrl: string, commit: string) {
    const { hostname, pathname } = urlParse(gitUrl);
    const [, project, repo] = pathname.split('/');

    this.baseUrl = `https://${hostname}`;
    this.project = project;
    this.repo = repo.split('.')[0];
    this.token = envWithGuard('BITBUCKET_SERVER_TOKEN');
    this.commit = commit;
  }

  insightsReportUrl(reportKey: string) {
    return `${this.baseUrl}/rest/insights/latest/projects/${
      this.project
    }/repos/${this.repo}/commits/${this.commit}/reports/${reportKey}`;
  }

  request(url: string, method = 'GET', body: object | null): Promise<Response> {
    const opts: RequestOptions = {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (body !== null) {
      opts.body = JSON.stringify(body);
    }

    return fetch(url, opts);
  }

  async _publishInsightsReport(
    reportKey: string,
    report: CodeInsightsReport,
  ): Promise<void> {
    const reportUrl = this.insightsReportUrl(reportKey);

    report.data = [];

    const response = await this.request(reportUrl, 'PUT', report);

    if (!response.ok) {
      const responseText = await response.text();
      const message = `Failed to publish report: ${
        response.status
      }\n${responseText}`;
      throw new Error(message);
    }
  }

  async publishInsightAnnotations(
    reportKey: string,
    annotations: CodeInsightsAnnotation[],
  ) {
    const annotationUrl = `${this.insightsReportUrl(reportKey)}/annotations`;
    const response = await this.request(annotationUrl, 'POST', {
      annotations,
    });

    if (!response.ok) {
      const responseText = await response.text();
      const message = `Failed to publish annotations: ${
        response.status
      }\n${responseText}`;
      throw new Error(message);
    }

    return response;
  }

  async getPullRequestPage(
    start = 0,
    limit = 25,
  ): Promise<PullRequestsApiResult> {
    const fetchUrl = `${this.baseUrl}/rest/api/1.0/projects/${
      this.project
    }/repos/${this.repo}/pull-requests?limit=${limit}&start=${start}`;

    const pullRequestsResponse = await this.request(fetchUrl, undefined, null);

    return (await pullRequestsResponse.json()) as PullRequestsApiResult;
  }

  async getTargetBranch(sourceBranch: string): Promise<string | null> {
    let start = 0;
    let pullRequest: PullRequests | null = null;
    let page;
    do {
      // eslint-disable-next-line no-await-in-loop
      page = await this.getPullRequestPage(start, 25);
      const found = page.values.find(
        pr => pr.fromRef.displayId === sourceBranch,
      );
      if (found) {
        pullRequest = found;
      }
      start = page.nextPageStart;
    } while (!page.isLastPage && !pullRequest);

    if (!pullRequest) {
      return null;
    }

    return pullRequest.toRef.displayId;
  }

  reportTemplate(insightsReport: InsightsReport) {
    return {
      details: insightsReport.details,
      title: 'Duplicates report',
      vendor: 'Beautiful Insights',
      logoUrl:
        'https://usagetracker.us-east-1.staging.atl-paas.net/tracker/jfp-small.png?e=duplicates-report', // TODO: new logo
      result: insightsReport.status,
    };
  }

  publishInsightsReport = async (insightsReport: InsightsReport) => {
    await this._publishInsightsReport(
      REPORT_KEY,
      this.reportTemplate(insightsReport),
    );

    const annotations = insightsReport.annotations.map(annotation => {
      const hash = crypto.createHash('sha256');
      hash.update(annotation.message, 'utf8');
      return {
        ...annotation,
        externalId: `risk-${hash.digest('hex')}`,
      };
    });

    this.publishInsightAnnotations(REPORT_KEY, annotations);
  };
}
