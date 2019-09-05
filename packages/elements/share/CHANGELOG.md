# @atlaskit/share

## 0.6.6

### Patch Changes

- [patch][f69c99217c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f69c99217c):

  The tooltip is now closed when user clicks on the share button (so it does not remains forever visible)

## 0.6.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.6.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 0.6.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.6.2

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 0.6.1

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 0.6.0

### Minor Changes

- [minor][bc0d3bf0b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bc0d3bf0b2):

  added tooltip support for elements/share

## 0.5.16

### Patch Changes

- [patch][ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):

  popper has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 0.5.15

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/form@6.1.5
  - @atlaskit/toggle@8.0.0

## 0.5.14

### Patch Changes

- [patch][8fb78b50c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb78b50c8):

  Error boundary added with analytics, various cleanups

## 0.5.13

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 0.5.12

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.5.11

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.5.10

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 0.5.9

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/inline-dialog@12.0.5
  - @atlaskit/user-picker@4.0.13
  - @atlaskit/select@10.0.0

## 0.5.8

### Patch Changes

- [patch][540b9336e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/540b9336e9):

  FS-4008 add shareeAction

## 0.5.7

### Patch Changes

- [patch][adcabaf0cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adcabaf0cd):

  FS-4025 add contentType attribute to copyShareLink event

## 0.5.6

### Patch Changes

- [patch][469b504df8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/469b504df8):

  feat: better short url analytics

## 0.5.5

### Patch Changes

- [patch][d6d7086f3f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6d7086f3f):

  feat: intelligently default to current page URL, even if there is a PWA navigation

## 0.5.4

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/form@6.1.1
  - @atlaskit/flag@12.0.10
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/select@9.1.8
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/user-picker@4.0.12
  - @atlaskit/icon@19.0.0

## 0.5.3

### Patch Changes

- [patch][5212dd363e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5212dd363e):

  feat: new analytics around URL shortening (+internal refactors)

## 0.5.2

### Patch Changes

- [patch][db798d5186](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db798d5186):

  fix: handle an "is mounted" path

## 0.5.1

### Patch Changes

- [patch][b53dd55ae8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53dd55ae8):

  fix: invalid property being used in URL shortener client

## 0.5.0

### Minor Changes

- [minor][dc965edbe6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc965edbe6):

  BREAKING new optional URL shortening feature (prop change needed)

## 0.4.17

### Patch Changes

- [patch][86e8cc40b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86e8cc40b7):

  FS-3948 add translations

## 0.4.16

### Patch Changes

- [patch][068e17f712](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/068e17f712):

  FS-3966 add bottomMessage property

## 0.4.15

### Patch Changes

- [patch][6fba3189dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fba3189dd):

  internal refactor: remove getDerivedStateFromProps in favor of memoization

## 0.4.14

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/form@6.0.6
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/user-picker@4.0.4
  - @atlaskit/tooltip@15.0.0

## 0.4.13

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/flag@12.0.4
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/user-picker@4.0.3
  - @atlaskit/icon@18.0.0

## 0.4.12

### Patch Changes

- [patch][e6c0741a32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6c0741a32):

  fix incorrect origin tracing in analytics + small internal cleanups

## 0.4.11

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 0.4.10

- Updated dependencies [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
  - @atlaskit/flag@12.0.0

## 0.4.9

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/field-text-area@6.0.1
  - @atlaskit/form@6.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/user-picker@4.0.1
  - @atlaskit/section-message@4.0.0

## 0.4.8

- [patch][466682024f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/466682024f):

  - TEAMS-480: Sending team member counts via share analytics

## 0.4.7

- [patch][cfc3d669d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3d669d8):

  - added share content type to submit share analytics event

## 0.4.6

- [patch][2a64153b7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a64153b7a):

  - fixed escape key press closes share dialog when user picker menu is open

## 0.4.5

- [patch][03957e8674](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03957e8674):

  - deferred fetchConfig call until share dialog is triggered open

## 0.4.4

- [patch][c27888ddff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c27888ddff):

  - added blogpost shared message and improved on documentation

## 0.4.3

- [patch][c63137e1ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c63137e1ed):

  - fixed admin is notified flag shows up with no request access

## 0.4.2

- [patch][50cd881689](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50cd881689):

  - fixed escape key press closes share dialog when user picker menu is open

## 0.4.1

- [patch][b684bc706c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684bc706c):

  - added and set default config when client.getConfig fails

## 0.4.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.3.15

- [patch][7461d7df4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7461d7df4e):

  - added support to text-only Dialog Trigger Button

## 0.3.14

- [patch][ffd178d638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffd178d638):

  - exposed renderCustomTriggerButton prop in ShareDialogContainer

## 0.3.13

- [patch][f692c5e59c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f692c5e59c):

  - updated user picker field email validity check and ui copies for domain based user only invite in share component

## 0.3.12

- [patch][00c4559516](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c4559516):

  - updated copies for placeholder and no result message for user picker field in share and added localizations for icon labels

## 0.3.11

- [patch][131d76e6fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/131d76e6fc):

  - updated flag model in elements/share

## 0.3.10

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-text-area@5.0.4
  - @atlaskit/flag@10.0.6
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/user-picker@3.4.2
  - @atlaskit/theme@8.1.7

## 0.3.9

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.3.8

- [patch][95293c5550](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95293c5550):

  - Added documentation and consolidated example

## 0.3.7

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/field-text-area@5.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 0.3.6

- [patch][e03dea5f5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e03dea5f5d):

  - FS-3792 do no call loadUser on empty query

## 0.3.5

- [patch][77c2d7bb2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77c2d7bb2b):

  - Added flags for successful share

## 0.3.4

- [patch][0f4109e919](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f4109e919):

  - FS-3743 remove loading message from user picker

## 0.3.3

- [patch][66512e9026](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66512e9026):

  - FS-3764 move dependencies to peer dependencies

## 0.3.2

- [patch][c68b454ba9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c68b454ba9):

  - fixed unclear share panel state upon successful share

## 0.3.1

- [patch][ddfc158dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ddfc158dfb):

  - Removed unused buttonStyle prop

## 0.3.0

- [minor][b617f099aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b617f099aa):

  - Limited length of comment messages.

## 0.2.10

- [patch][69c72e07ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c72e07ba):

  - Fixed share button off position on IE11

## 0.2.9

- [patch][fcdae04b8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fcdae04b8c):

  - FS-3620 add share analytics

## 0.2.8

- [patch][13d9986e40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13d9986e40):

  - fixed dialogue header font settings

## 0.2.7

- [patch][26a3d443e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26a3d443e2):

  - fix warning when unmounting share doesn't cancel the async requests

## 0.2.6

- [patch][3161a93cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3161a93cdb):

  - FS-3289 update share copy

## 0.2.5

- [patch][9babee9fc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9babee9fc2):

  - Fix share modal padding

## 0.2.4

- [patch][8f56fe1259](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f56fe1259):

  - Remove files from package.json to publish all the files in @atlaskit/share

## 0.2.3

- Updated dependencies [3ea3f5ea55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea3f5ea55):
  - @atlaskit/user-picker@3.0.0

## 0.2.2

- [patch][9ce45faaf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ce45faaf8):

  - adjustments for design review

## 0.2.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.2.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.1.18

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/user-picker@1.0.25
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/field-text-area@5.0.0
  - @atlaskit/form@5.1.8
  - @atlaskit/inline-dialog@10.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 0.1.17

- [patch][af38e4649a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af38e4649a):

  - exposed shareContentType prop

## 0.1.16

- [patch][aca247a78b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aca247a78b):

  - Exposed shareFormTitle prop to customise Share Form title
  - Removed object type from Copy link button

## 0.1.15

- [patch][312572b5f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/312572b5f8):

  - FS-3618 consume configuration in the UserPickerField

## 0.1.14

- [patch][4d3226b06b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d3226b06b):

  - exposed trigger button appearance prop

## 0.1.13

- [patch][3f5be35333](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5be35333):

  - Fixed errors and warnings in elements/share unit tests

## 0.1.12

- [patch][376926523b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/376926523b):

  - Explosed buttonStyle prop to ShareDialogContainer

## 0.1.11

- [patch][7e809344eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e809344eb):

  - Modified share web component to send a single atlOriginId

## 0.1.10

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-test-helpers@7.0.0

## 0.1.9

- [patch][7569356ab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7569356ab3):

  - FS-3417 add email warning, save intermediate state if click outside

## 0.1.8

- [patch][d1fbdc3a35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1fbdc3a35):

  - enable noImplicitAny for share. fix related issues

## 0.1.7

- [patch][8e0ea83f02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e0ea83f02):

  - Added ShareDialogContainer component

## 0.1.6

- [patch][1d284d2437](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d284d2437):

  - FS-3417 added ShareButton, ShareDialogTrigger components to @atlaskit/share

## 0.1.5

- [patch][2f73eeac57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f73eeac57):

  - Added ShareServiceClient and unit test

- [patch][8c905d11b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c905d11b7):

  - Added share service client

## 0.1.4

- [patch][b752299534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b752299534):

  - Added capabilities info message in ShareForm

## 0.1.3

- [patch][42bfdcf8ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42bfdcf8ed):

  - Added CopyLinkButton component and integrated into ShareForm

## 0.1.2

- [patch][48856cfa79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48856cfa79):

  - Added IdentityClient and unit tests

## 0.1.1

- [patch][64bf358](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64bf358):

  - FS-3416 add ShareForm component to @atlaskit/share

## 0.1.0

- [minor][891e116](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/891e116):

  - FS-3291 add share skeleton
