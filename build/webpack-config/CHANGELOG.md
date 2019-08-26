# @atlaskit/webpack-config

## 2.0.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.0.12

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.0.11

- Updated dependencies [688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):
  - @atlaskit/multi-entry-tools@0.0.2

## 2.0.10

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/visual-regression@0.1.0

## 2.0.9

- [patch][3b48f804d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b48f804d7):

  - Prefer atlaskit:src over module when building

## 2.0.8

- [patch][0744bd168d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0744bd168d):

  - Prefer atlaskit:src over module when building

## 2.0.7

- [patch][1b9e213](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b9e213):

  - Make local builds 20s faster

## 2.0.6

- [patch][eb19d6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb19d6a):

  - Disable some stats to make webpack faster

## 2.0.5

- [patch][92d8324](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92d8324):

  - Fix build not exiting with non-zero exit code on failure

## 2.0.4

- [patch] suppress "export not found" warnings for ts transpiling in webpack [9baa015](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9baa015)

## 2.0.3

- [patch] Upgrade to webpack 4 [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)
- [patch] Updated dependencies [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)
  - bolt-fs-loader@0.0.1

## 2.0.2

- [patch] Migrate Profilecard to AKM2 DIR-553 [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)

## 2.0.1

- [patch] adds environment variable for whether the atlaskit website is running locally, in staging or in production [a04c1c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a04c1c5)

## 2.0.0

- [major] Updated website to use iframe to load examples. Example loader now in a separate react app. Webpack config refactored to compile separate example loader, chunking refactored to be more performant with the new website changes. Updated modal-dialog to use new component structure to optionally specify a Body wrapping component. [e1fdfd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1fdfd8)
