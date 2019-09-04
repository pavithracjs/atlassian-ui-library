# @atlaskit/visual-regression

## 0.1.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.1.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.1.1

### Patch Changes

- [patch][2c3153bb56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c3153bb56):

  BUILDTOOLS-108 Fail Webdriver & Puppeteer test runs on CI either when tests fail or a snapshot is added

  This will prevent people forgetting to add snapshots

  This will also no longer fail the build on obsolete snapshots for the Webdriver tests. This was a problem because the Landkid build only runs tests on Chrome and we should allow tests that skip Chrome (eg. a Mac-specific test will only run on Safari)

## 0.1.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.0.1

initial commit enabling visual-regression
