# `@atlaskit/code-insights`
This is a tool that can be run on you checkout  OR on CI to report on code problems.

## CLI Flags
`--commit`       The commit to publish insights on [default=current head]

`--reporters`    The reporters to run [default=console]

`--gitUrl`       The git url of the repo [default=current origin url]

`--targetBranch` The branch with which to compare the current branch, when git reporting is enabled can detect PR target branch. [default=master]

## Reports
The tool is setup in a way that reports should be easy to add later. If you have a good idea for a report
go for it and submit a PR!

### yarn lock duplicates 
This report compares the lock file of the current branch to the one on `origin/master`.
It then reports the new duplicate dependencies found compared to master. 

#### Requirements
This report requires `origin/master` to be available. If you're getting the following error: 

```
Command failed: git show origin/master:package.json
fatal: Invalid object name 'origin/master'.
```

Your CI job is probably running on a shallow clone. This error can be fixed on bamboo with the following commands:

```sh
git remote set-url origin "${bamboo_planRepository_repositoryUrl}"
git fetch origin
```

## Reporters
The tool is setup in a way that reporters should be easy to add later. If you have a good idea for a report
go for it and submit a PR!

### Bitbucket server code-insights (bbs)
This report uses the [Bitbucket server code insights](https://community.developer.atlassian.com/t/introducing-code-insights-for-bitbucket-server-continuously-improve-code-quality-with-quick-actionable-feedback-from-apps/23148) feature to show the code-insights report.

If this reporter is enabled and now `targetBranch` flag is provided, the reporter will try to detect the target branch of the PR the top commit is on. When targetting a different branch than `master` the report is generated using that branch instead.

#### Requirements
Authentication for BB server is required. The following options are provided:

#### API Key
The recommended way of authentication

`BITBUCKET_SERVER_TOKEN` : the BB server API token

#### Basic auth
`BITBUCKET_SERVER_USERNAME` : Bitbucket Server Username

`BITBUCKET_SERVER_PASSWORD` : Bitbucket Server Password


### Console (console)
This reporters just reports the result to the console. Handy when running locally.


