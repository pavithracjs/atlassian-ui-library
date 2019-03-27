import fetch from 'node-fetch';
import urlParse from 'url-parse';

export enum Severity {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

// TODO: Expose this through the CLI
const DRY_RUN = false;

export type CodeInsightsAnnotation = {
  externalId: string;
  message: string;
  path: string;
  line: number;
  severity: Severity; // TODO: There are probably more?
};

export enum CodeInsightsReportResults {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export type CodeInsightsReport = {
  data?: object[];
  details: string;
  title: string;
  vendor: string;
  logoUrl: string;
  result: CodeInsightsReportResults;
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

export default class Bitbucket {
  baseUrl: string;
  project: string;
  repo: string;
  token: string;
  commit: string;

  constructor(gitUrl: string, token: string, commit: string) {
    const { hostname, pathname } = urlParse(gitUrl);
    const [, project, repo] = pathname.split('/');

    this.baseUrl = `https://${hostname}`;
    this.project = project;
    this.repo = repo.split('.')[0];
    this.token = token;
    this.commit = commit;
  }

  insightsReportUrl(reportKey: string) {
    return `${this.baseUrl}/rest/insights/latest/projects/${
      this.project
    }/repos/${this.repo}/commits/${this.commit}/reports/${reportKey}`;
  }

  request(url: string, method = 'GET', body: object | null) {
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

    if (DRY_RUN) {
      console.log('Dry run mode, Bitbucket reporter wanted to sent:');
      console.log(`url: ${url}`);
      console.log(opts);
      return Promise.resolve({
        ok: true,
        status: 200,
        text() {
          return '';
        },
        json() {
          return {};
        },
      });
    }

    return fetch(url, opts);
  }

  async publishInsightsReport(reportKey: string, report: CodeInsightsReport) {
    const reportUrl = this.insightsReportUrl(reportKey);
    console.log(`PUTting report to ${reportUrl}`);

    report.data = [];

    const response = await this.request(reportUrl, 'PUT', report);
    if (!response.ok) {
      const responseText = await response.text();
      const message = `Failed to publish report: ${
        response.status
      }\n${responseText}`;
      throw new Error(message);
    }
    return response;
  }

  async publishInsightAnnotations(
    reportKey: string,
    annotations: CodeInsightsAnnotation[],
  ) {
    const annotationUrl = `${this.insightsReportUrl(reportKey)}/annotations`;
    console.log(`POSTting annotations to ${annotationUrl}`);
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

    console.log(`Fetch ${fetchUrl}`);
    const pullRequestsResponse = await this.request(fetchUrl, undefined, null);

    return pullRequestsResponse.json() as PullRequestsApiResult;
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
}
