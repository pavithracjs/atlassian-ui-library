# @atlaskit/media-client

## 1.3.0

### Minor Changes

- [minor][61ed1951ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61ed1951ce):

  Expose getFileBinaryURL method in mediaClient.file.getFileBinaryURL

## 1.2.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 1.2.0

- [minor][dcda79d48c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dcda79d48c):

  - `withMediaClient` and associated Props are introduced to make possible soft transition from Context based media components to Media Client Config ones.

- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-test-helpers@24.0.0

## 1.1.5

- [patch][af1cbd4ce4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af1cbd4ce4):

  - Removing unnecessary deps and dev deps in media-core and media-client

## 1.1.4

- [patch][12aa76d5b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12aa76d5b5):

  - ED-6814: fixed rendering mediaSingle without collection

## 1.1.3

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 1.1.2

- [patch][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.1.1

- [patch][2f58d39758](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f58d39758):

  - Fix problem with double exporting one of the existing items

## 1.1.0

- [minor][8536258182](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8536258182):

  - expose on + off + emit methods on client in order to communicate events with integrators. At this point the only emitted event is 'file-added'

## 1.0.0

- [major][e38d662f7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e38d662f7d):

  - Media API Web Client Library initial release. It contains mostly combined code from media-core and media-store.

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0
