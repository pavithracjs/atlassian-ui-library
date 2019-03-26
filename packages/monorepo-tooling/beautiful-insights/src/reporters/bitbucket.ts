const fetch = require('node-fetch');
const urlParse = require('url-parse');

const isString = (str: string | undefined | null) => typeof str === 'string';

class Bitbucket {
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

  request(url: string, method = 'GET', body = null) {
    const opts = {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: isString(body) ? body : JSON.stringify(body),
    };
    return fetch(url, opts);
  }

  async publishInsightsReport(reportKey: string, report) {
    const reportUrl = this.insightsReportUrl(reportKey);
    console.log(`PUTting report to ${reportUrl}`);

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

  async publishInsightAnnotations(reportKey, annotations) {
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

  async getPullRequestPage(start = 0, limit = 25) {
    const fetchUrl = `${this.baseUrl}/rest/api/1.0/projects/${
      this.project
    }/repos/${this.repo}/pull-requests?limit=${limit}&start=${start}`;

    console.log(`Fetch ${fetchUrl}`);
    const pullRequestsResponse = await this.request(fetchUrl);

    return pullRequestsResponse.json();
  }

  async getTargetBranch(sourceBranch) {
    let start = 0;
    let pullRequest = null;
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

module.exports = {
  Bitbucket,
};
