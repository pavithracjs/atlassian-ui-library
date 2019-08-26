# @atlaskit/dependency-version-analytics

## 0.1.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.1.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.1.5

### Patch Changes

- [patch][b9b8222978](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9b8222978):

  @types/node-fetch was declared in devDependencies and dependencies. Move @types/node-fetch, @types/node, @types/url-parse from dependencies to devDependencies.

## 0.1.4

### Patch Changes

- [patch][620613c342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620613c342):

  Fix regression in populate-package where new packages would throw an error

## 0.1.3

### Patch Changes

- [patch][10b3af15f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10b3af15f6):

  Fix version.json (cli version in analytics) being one version behind

## 0.1.2

### Patch Changes

- [patch][50ddd93885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ddd93885):

  - [populate-package] Fix upgradeType erroneously set to 'add' instead of 'upgrade' for the first event sent using --since
  - Add new upgradeType 'downgrade' to analytics payloads when a package is downgraded, typically after a rollback.

## 0.1.1

### Patch Changes

- [patch][b0c82fff8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0c82fff8f):

  Add '--no-interactive' flag to disable interactive prompts

## 0.1.0

### Minor Changes

- [minor][94835b2d03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94835b2d03):

  Initial version
