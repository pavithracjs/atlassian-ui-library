# `@atlaskit/dependency-version-analytics`

This is a tool that sends dependency version upgrade analytics to the GASv3 pipeline by running inside a product codebase and analysing git history.

## Install

`yarn add --dev @atlaskit/dependency-version-analytics @atlassiansox/analytics-node-client`

The `@atlassiansox/analytics-node-client` package is a peer dependency as it is a private package and so must be installed alongside the tool.

## Local development

To develop on this locally, you'll need to first install the peer dependency temporarily by running the following inside the package:

`npm i @atlassiansox/analytics-node-client --no-save`

You then have two options:

### 1) Use yarn link

This will run the 'dev' mode of the tool and compile typescript on the fly. Any changes made to the source will instantly reflect in the product repo.

1. Run `yarn link` inside the package
2. Run `yarn link add '@atlaskit/dependency-version-analytics'` inside the product repo of your choosing

Make dev changes + save.

### 2) Use yalc publish

This will run the built version of the tool that will be published to npm. It will use the compiled typescript output and will not allow 'hot module reload'.

1. Install yalc globally - `yarn global add yalc`

After each dev change,

1. Run `yarn build:typescript:cli` outside the package
2. Run `yalc publish` inside the package
3. Run `yalc add '@atlaskit/dependency-version-analytics'` inside the product repo of your choosing

## Commands

### populate-product <product>

Sends historical analytics events of atlaskit dependency changes to package.json that have occurred over the course of the git history of the current commit (typically master).

#### Args

`<product>` The product the tool is running in, e.g. `jira`, `confluence`.

#### Flags

`--csv` Prints AK dependency history in CSV format
`--dev` Send analytics to dev analytics pipeline instead of prod
`--dryRun` Performs a dry run, prints analytics events to console in JSON format instead of sending them

#### Example

```sh
$ atlaskit-version-analytics populate-product jira
```

#### Description

This reads the git history of changes to package.json in the current branch (assumed to be master), tracks changes to atlaskit dependencies and sends analytics in the format specified by http://go.atlassian.com/analytics/registry/17058.

You will only want to run this command once to prevent duplicate events ending up in the event store.
