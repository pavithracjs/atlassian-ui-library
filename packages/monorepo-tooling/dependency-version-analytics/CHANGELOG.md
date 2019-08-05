# @atlaskit/dependency-version-analytics

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
