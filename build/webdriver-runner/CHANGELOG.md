# @atlaskit/webdriver-runner

## 0.1.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.1.3

### Patch Changes

- [patch][2c3153bb56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c3153bb56):

  BUILDTOOLS-108 Fail Webdriver & Puppeteer test runs on CI either when tests fail or a snapshot is added

  This will prevent people forgetting to add snapshots

  This will also no longer fail the build on obsolete snapshots for the Webdriver tests. This was a problem because the Landkid build only runs tests on Chrome and we should allow tests that skip Chrome (eg. a Mac-specific test will only run on Safari)

## 0.1.2

### Patch Changes

- [patch][0202c1d464](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0202c1d464):

  [ED-7076] Improve table performance reducing the number of React elements on ColumnControl, moving out InsertButton component.

## 0.1.1

- [patch][2d6d5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6d5b6):

  - ED-5379: rework selecting media under the hood; maintain size and layout when copy-pasting

## 0.1.0

- [minor] Add debug command [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)

## 0.0.3

- [patch] Remove linkCreateContext from default options and add userAuthProvider [fc2ca7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc2ca7a)

## 0.0.2
