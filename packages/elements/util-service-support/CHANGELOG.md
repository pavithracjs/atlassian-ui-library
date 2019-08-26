# @atlaskit/util-service-support

## 4.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 4.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.5

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 4.0.3

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/docs@8.0.0

## 4.0.2

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 4.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 4.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 3.1.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0

## 3.1.0

- [minor][1d19234fbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d19234fbd):

  - Enable noImplicitAny and resolve issues for elements util packages

## 3.0.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/docs@6.0.0

## 3.0.4

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 3.0.3

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 3.0.2

- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)

## 3.0.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/docs@5.0.2

## 3.0.0

- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/docs@5.0.0

## 2.0.12

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)

## 2.0.11

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/docs@4.1.1

## 2.0.10

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0

## 2.0.9

- [patch] FS-797 Allow setting url for pubsub example and fix url-search-params import style [1c85e67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c85e67)

## 2.0.8

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/docs@4.0.0

## 2.0.7

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/docs@3.0.4

## 2.0.6

- [patch] Fixed tsconfig in build/es5 [c8e55d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8e55d0)

## 2.0.5

- [patch] FS-1698 migrated util-service-support to mk-2 [e0bcb61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0bcb61)

## 2.0.4 (2018-02-06)

- bug fix; added omitCredentials to SecurityOptions ([88cb203](https://bitbucket.org/atlassian/atlaskit/commits/88cb203))

## 2.0.3 (2017-12-26)

- bug fix; remove @atlaskit/util-common-test from devDependencies ([e9faeab](https://bitbucket.org/atlassian/atlaskit/commits/e9faeab))
- bug fix; add url-search-params as a dependency (issues closed: fs-1091) ([b33cdcf](https://bitbucket.org/atlassian/atlaskit/commits/b33cdcf))

## 2.0.2 (2017-09-12)

- bug fix; requestService can handle 204 responses with no content ([edf13d5](https://bitbucket.org/atlassian/atlaskit/commits/edf13d5))

## 2.0.1 (2017-07-24)

- fix; make sure types from utils are exports (extracted types to separate file) ([ebde291](https://bitbucket.org/atlassian/atlaskit/commits/ebde291))

## 1.0.0 (2017-07-24)

- feature; extract common service integration code into a shared library ([5714832](https://bitbucket.org/atlassian/atlaskit/commits/5714832))
