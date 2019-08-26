# @atlaskit/code-insights

## 1.1.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 1.1.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 1.1.6

### Patch Changes

- [patch][8a30920bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a30920bec):

  Fix false positives for duplicate dependencies in code-insights.

## 1.1.5

### Patch Changes

- [patch][90de42e3ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90de42e3ac):

  Change the code-insights tool to compare the duplicates of the latest commit with the branch of point with master. Instead of the current behaviour of comparing branch with origin/master.

## 1.1.4

### Patch Changes

- [patch][a7e403fc68](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7e403fc68):

  @types/node-fetch was declared in devDependencies and dependencies. Move @types/node-fetch, @types/node, @types/url-parse from dependencies to devDependencies.

## 1.1.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 1.1.2

- [patch][96d9e78615](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96d9e78615):

  - Fix flawed targetbranch logic

## 1.1.1

- [patch][d3d376241a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3d376241a):

  - Creating a patch for the readme chagne

## 1.1.0

- [minor][f782c6a37d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f782c6a37d):

  - Add basicAuth support for bitbucket-server reporter

## 1.0.1

- [patch][353aa4a2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353aa4a2dd):

  - Fix bin directory in package.json

## 1.0.0

- [major][dc294c47bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc294c47bb):

  - Release first version of code-insights tool

## 0.0.3

- [patch][ff246f306c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff246f306c):

  - Fixed some bugs

## 0.0.2

- [patch][7a1316f335](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a1316f335):

  - First version of beautiful insights
