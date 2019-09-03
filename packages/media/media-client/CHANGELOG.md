# @atlaskit/media-client

## 2.1.2

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-test-helpers@25.1.1
  - @atlaskit/media-card@65.0.0

## 2.1.1

### Patch Changes

- [patch][9c28ef71fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c28ef71fe):

  Add missing peerDependency in package.json

## 2.1.0

### Minor Changes

- [minor][e5c3f6ae3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5c3f6ae3e):

  ED-6216: External images will now be uploaded to media services if possible

## 2.0.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.0.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 2.0.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.0.2

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 2.0.1

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-test-helpers@25.0.0

## 2.0.0

### Major Changes

- [major][ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):

  Remove getCurrentState method from FileStreamCache

  Before you could do:

  ```
  import {getFileStreamsCache} from '@atlaskit/media-client'

  const currentFileState = await getFileStreamsCache().getCurrentState('some-uuid');
  ```

  That will return the last state from that fileState in a promise rather than having to
  use Observables to subscribe and get the last event.

  Now you could just use the already existing method getCurrentState from mediaClient:

  ```
  import {getMediaClient} from '@atlaskit/media-client';

  const mediaClient = getMediaClient({
    mediaClientConfig: {} // Some MediaClientConfig
  });
  const state = await mediaClient.file.getCurrentState('some-uuid');
  ```

## 1.5.3

### Patch Changes

- [patch][13eed9b89c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13eed9b89c):

  populate media cache when using FileFetcher:copyFile

## 1.5.2

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 1.5.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 1.5.0

### Minor Changes

- [minor][60af38e3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60af38e3f7):

  Expose globalMediaEventEmitter to allow consumers to subscribe to global events rather than per context/mediaClient instance

  ```
  //
  // BEFORE
  //
  import {ContextFactory} from '@atlaskit/media-core'

  const context = ContextFactory.create();

  // Events happen per instance
  context.on('file-added', ...)

  //
  // NOW
  //

  import {globalMediaEventEmitter} from '@atlaskit/media-client';

  // Context happens globally on any upload. This is needed since there might be multiple mediaClient instances at runtime
  globalMediaEventEmitter.on('file-added', ...);
  ```

## 1.4.0

### Minor Changes

- [minor][02185fba43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02185fba43):

  getMediaClient is now exposed

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
