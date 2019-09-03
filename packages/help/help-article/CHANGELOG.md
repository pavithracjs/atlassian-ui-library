# @atlaskit/help-article

## 0.5.4

### Patch Changes

- [patch][a05133283c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a05133283c):

  Add missing dependency in package.json

## 0.5.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.5.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.5.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.5.0

### Minor Changes

- [minor][07c2c73a69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07c2c73a69):

  Removed hardcoded styles. Added unit test

## 0.4.7

### Patch Changes

- [patch][bd4725ae18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd4725ae18):

  Fix list styling (IE11)

## 0.4.6

### Patch Changes

- [patch][c895bb78fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c895bb78fc):

  Updated styles

## 0.4.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 0.4.4

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 0.4.3

- [patch][75efe3ab05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75efe3ab05):

  - Updated dependencies

## 0.4.2

- [patch][36558f8fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36558f8fb2):

  - Updated CSS styles

## 0.4.1

- [patch][7ad5551b05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ad5551b05):

  - Updated/fix CSS styles

## 0.4.0

- [minor][05460c129b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05460c129b):

  - Added prop titleLinkUrl to make the title of the article a link

## 0.3.1

- [patch][d3a2a15890](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3a2a15890):

  - Made HelpArticle the default export (fix)

## 0.3.0

- [minor][801e8de151](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/801e8de151):

  - Made HelpArticle the default export. Added styles from Contentful

## 0.2.0

- [minor][d880cc2200](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d880cc2200):

  - First release of global-article
