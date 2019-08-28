# @atlaskit/user-picker

## 4.0.22

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 4.0.21

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.20

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 4.0.19

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

## 4.0.18

- Updated dependencies [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag@9.0.0

## 4.0.17

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 4.0.16

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.15

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 4.0.14

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

## 4.0.13

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/select@10.0.0

## 4.0.12

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/field-base@13.0.6
  - @atlaskit/select@9.1.8
  - @atlaskit/tag@8.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 4.0.11

### Patch Changes

- [patch][40e6908409](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40e6908409):

  pass session id to on selection

## 4.0.10

### Patch Changes

- [patch][06f5bbf5a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06f5bbf5a9):

  start session onfocus

## 4.0.9

### Patch Changes

- [patch][c91e37e5f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c91e37e5f1):

  pass session id to onFocus, onBlur, onClose and onInputChange

## 4.0.8

### Patch Changes

- [patch][77ef850a35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77ef850a35):

  Fix click and hover behaviours of disabled single user picker

## 4.0.7

### Patch Changes

- [patch][25b3ec24af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25b3ec24af):

  add optional session id to async loadoption

## 4.0.6

### Patch Changes

- [patch][b029d82e8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b029d82e8c):

  Handle scroll of box of user picker component

## 4.0.5

### Patch Changes

- [patch][9b0adb4ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0adb4ce7):

  Fix scrolling behaviour when picking a user in the multi user picker

## 4.0.4

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 4.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/tag@8.0.3
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 4.0.2

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 4.0.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/tag@8.0.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 3.5.5

- [patch][87c47cd667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87c47cd667):

  - Getting updated styles from tag

## 3.5.4

- [patch][b8bc454675](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bc454675):

  - Add inputId prop to allow label to open the user picker

## 3.5.3

- [patch][171feaa473](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/171feaa473):

  - FS-3792 clear results after selection

## 3.5.2

- [patch][7cb36f2603](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cb36f2603):

  - Fixed User Picker showing the spinner forever in some async use cases.

## 3.5.1

- [patch][3fbfd9d7f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fbfd9d7f5):

  - updated byline message for EmailOption based on email validity in user-picker

## 3.5.0

- [minor][e1abf3f31a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1abf3f31a):

  - Prevent popup user picker from being dismissed on clear.

## 3.4.3

- [patch][2f8c041db5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f8c041db5):

  - Corrected asynchronous user picker behaviour

## 3.4.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/tag@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 3.4.1

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 3.4.0

- [minor][4a8effc046](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a8effc046):

  - FS-3741 expose boundariesElement for integrators to pass in custom boundary

## 3.3.5

- [patch][0f4109e919](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f4109e919):

  - FS-3743 remove loading message from user picker

## 3.3.4

- [patch][93464f09e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93464f09e8):

  - TEAMS-328 : Changing byline logic

## 3.3.3

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 3.3.2

- [patch][3718bdc361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3718bdc361):

  - Updated InviteAvatorIcon in UserPicker to be not transparent

## 3.3.1

- [patch][83ad0552d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83ad0552d4):

  - Workaround SSR avatar issue in user-picker ssr tests

## 3.3.0

- [minor][4526b178cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4526b178cb):

  - Fixed uncaptured Enter key press on Input

## 3.2.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 3.1.1

- [patch][3161a93cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3161a93cdb):

  - FS-3289 update share copy

## 3.1.0

- [minor][1da59f9d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da59f9d31):

  - added ssr tests to user-picker

## 3.0.0

- [major][3ea3f5ea55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea3f5ea55):

  - FS-3548 integrators must explicitly set the context prop in user-picker

## 2.0.3

- [patch][552843a739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/552843a739):

  - FS-3639 fix analytics when no item is removed

## 2.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 2.0.1

- [patch][de8123519a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de8123519a):

  - FS-3675 add ability for integrator to add title to popup picker

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.1.1

- [patch][64c306c904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64c306c904):

  - FS-3599 remove logic to hide add more placeholder

## 1.1.0

- [minor][14af4044ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14af4044ea):

  - FS-3354 introduce PopupUserPicker to package

## 1.0.25

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/analytics-viewer@0.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/select@8.0.0
  - @atlaskit/tag@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 1.0.24

- [patch][97307d9dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97307d9dd1):

  - FS-3618 add isValidEmail prop to UserPicker

## 1.0.23

- [patch][ad1bd2a92e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad1bd2a92e):

  - FS-3605 expose prop to disable input

## 1.0.22

- [patch][46ffd45f21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46ffd45f21):

  - Added ability to toggle animations in atlaskit/select, updated UserPicker to disable animations using this new behaviour

## 1.0.21

- [patch][b38b2098e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b38b2098e3):

  - FS-3417 export utils functions

## 1.0.20

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/select@7.0.0

## 1.0.19

- [patch][1050084e29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1050084e29):

  - TEAMS-242 : Change user picker placeholder

## 1.0.18

- [patch][0809a67d7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0809a67d7b):

  - FS-3591 hide selected users from multi picker

## 1.0.17

- [patch][67f0d11134](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f0d11134):

  - FS-3577 show selected options by default

## 1.0.16

- [patch][c51d1e2e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c51d1e2e51):

  - FS-3573 show user avatar on focus

## 1.0.15

- [patch][1ce3a8812b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ce3a8812b):

  - FS-3458 call loadOptions if open prop is controlled
