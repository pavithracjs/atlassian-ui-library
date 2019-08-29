# @atlaskit/atlassian-switcher

## 3.24.0

### Minor Changes

- [minor][5f681ceea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f681ceea7):

  Add a tooltip dependency and hide tooltip on mouse down event

## 3.23.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.23.1

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 3.23.0

### Minor Changes

- [minor][c0f0ae12ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0f0ae12ce):

  yShow site avatars on switcher child items

## 3.22.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.22.0

### Minor Changes

- [minor][66d7234386](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66d7234386):

  Bumped up item version to pick up themable item width support

## 3.21.0

### Minor Changes

- [minor][0e43bd0082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e43bd0082):

  Use with width theming property now provided by Item

## 3.20.1

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

## 3.20.0

### Minor Changes

- [minor][a055fbda01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a055fbda01):

  yRemove description from items that don't have multiple sites

## 3.19.0

### Minor Changes

- [minor][d700e692be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d700e692be):

  Fix ellipsis on item with dropdown

## 3.18.0

### Minor Changes

- [minor][bdbe90c48b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdbe90c48b):

  FIND-133: Allow switcher to be rendered standalone (outside a drawer)

## 3.17.1

### Patch Changes

- [patch][04388187f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04388187f4):

  Added docs and details about i18n

## 3.17.0

### Minor Changes

- [minor][520e77bd9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/520e77bd9c):

  Fixed analytics bug for A/B testing product sorting algorithm for account-centric products

## 3.16.0

### Minor Changes

- [minor][74501ba0ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74501ba0ea):

  Accept a feature flag to AB test which site to show at the top of the product (efault being the current site, and variation being the most frequently visited)

## 3.15.0

### Minor Changes

- [minor][aac9ae7ee8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aac9ae7ee8):

  Licensed links in switcher are now grouped by product, with a dropdown that containing individual site options for sited products

## 3.14.0

### Minor Changes

- [minor][d4e8e68bf1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4e8e68bf1):

  Added adminLinks to switcher viewed event, so we could know when we show try discover more links to users. Fixed suggestedProductLinks that used to be empty on mount due to race conditions"

## 3.13.0

### Minor Changes

- [minor][43a5cd1e3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43a5cd1e3c):

  Adding isDiscoverMoreForEveryoneEnabled and onDiscoverMoreClicked props onto the Atlassian Switcher API

## 3.12.0

### Minor Changes

- [minor][6c449d7c77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c449d7c77):

  Also made cloud ID optional in the prefetch trigger

## 3.11.0

### Minor Changes

- [minor][f0eeeb4f8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0eeeb4f8a):

  Cloud ID is now an optional props. When Cloud ID is not provided, sections like recent containers, admin links, etc will be skipped and not rendered

## 3.10.0

### Minor Changes

- [minor][fee77d9245](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fee77d9245):

  Added an optional parameter to allow an option to disable custom links in Jira and Confluence switcher

## 3.9.0

### Minor Changes

- [minor][7bc30c4cce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bc30c4cce):

  Added a new prop to disable recent containers

## 3.8.2

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/drawer@5.0.0

## 3.8.1

### Patch Changes

- [patch][91ec1329f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91ec1329f7):

  Changing flag key for JSW to Opsgenie experiment

## 3.8.0

### Minor Changes

- [minor][3e25438208](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e25438208):

  Enables AtlassianSwitcher to receive recommendationFeatureFlags which is then passed to the RecommendationProvider to be parsed and handle output based on feature flag values.

## 3.7.0

### Minor Changes

- [minor][5ac638ae2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ac638ae2e):

  Revert the change that filteres the current product from the list of products in switcher because that makes filtering too eager

## 3.6.0

### Minor Changes

- [minor][f5d0b1aef8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5d0b1aef8):

  Removed the site-product combination the user is on from the switcher options

## 3.5.1

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 3.5.0

### Minor Changes

- [minor][a6dcd23804](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dcd23804):

  Add a new provider to suggest a list of recommended products, and refactor existing logic

## 3.4.6

### Patch Changes

- [patch][7016422921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7016422921):

  Passed in empty object in order to get the correct cache key

## 3.4.5

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 3.4.4

### Patch Changes

- [patch][3371cb9ba0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3371cb9ba0):

  Updated Atlassian Switcher prefecth trigger to accept enableUserCentricProducts feature flag

## 3.4.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 3.4.2

### Patch Changes

- [patch][4344114172](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4344114172):

  Update analytics event to include products shown when viewed.

## 3.4.1

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

## 3.4.0

### Minor Changes

- [minor][986a1cc91d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/986a1cc91d):

  Enable prefetching for available-products endpoint

## 3.3.0

### Minor Changes

- [minor][b81d931ee3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d931ee3):

  Added new OpsGenie logo, fixed the gradient for the StatusPage logo, and refactored atlassian-switcher to use the new logos

## 3.2.0

### Minor Changes

- [minor][85291ccc2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85291ccc2b):

  Infer xflow enabled flag from props

## 3.1.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/drawer@4.2.1
  - @atlaskit/item@10.0.5
  - @atlaskit/navigation@35.1.8
  - @atlaskit/icon@19.0.0

## 3.1.0

### Minor Changes

- [minor][af2d3ce4f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af2d3ce4f0):

  Fire a ui viewed atlassianSwitcher event on mount

## 3.0.0

### Major Changes

- [major][2258719b5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2258719b5f):

  Add enableUserCentricProducts to Switcher. Remove enableExpandLink.

  The expand link is now displayed when user-centric mode is enabled,
  and the amount of products to display exceeds the threshold of 5.

  To upgrade: Delete any references to enableExpandLink/experimental_enableExpandLink

## 2.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/drawer@4.1.3
  - @atlaskit/item@10.0.2
  - @atlaskit/navigation@35.1.5
  - @atlaskit/icon@18.0.0

## 2.1.0

- [minor][caa9ae9dbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/caa9ae9dbf):

  - Split Jira link into individual product links in Atlassian Switcher

## 2.0.1

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/item@10.0.1
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 2.0.0

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/icon@17.0.2
  - @atlaskit/navigation@35.1.1
  - @atlaskit/logo@12.0.0

## 1.1.1

- [patch][d216253463](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d216253463):

  - Fix trigger xflow invoked with incorrect arguments

## 1.1.0

- [minor][b3381f5c07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3381f5c07):

  - Add domain to analytics

## 1.0.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/analytics-gas-types@4.0.4
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/drawer@4.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/item@10.0.0
  - @atlaskit/logo@11.0.0
  - @atlaskit/lozenge@8.0.0
  - @atlaskit/navigation@35.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/type-helpers@4.0.0
  - @atlaskit/analytics-namespaced-context@4.0.0

## 0.5.0

- [minor][59024ff4c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59024ff4c5):

  - Always include Jira Service Desk cross sell link if the instance does not have Jira Service Desk license.

## 0.4.8

- [patch][7f9fd0ddfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f9fd0ddfc):

  - Improve error messages and analytics

## 0.4.7

- [patch][3eeb2ccf51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3eeb2ccf51):

  - Update translations

## 0.4.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 0.4.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/drawer@3.0.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/logo@10.0.4
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/navigation@34.0.4
  - @atlaskit/theme@8.1.7

## 0.4.4

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.4.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/drawer@3.0.6
  - @atlaskit/icon@16.0.8
  - @atlaskit/logo@10.0.3
  - @atlaskit/navigation@34.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 0.4.1

- [patch][bcb3d443fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bcb3d443fc):

  - Addressing QA fixes

## 0.4.0

- [minor][e36f791fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e36f791fd6):

  - Improve types

## 0.3.6

- [patch][db2a7ffde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db2a7ffde6):

  - Fixing recent containers bug

## 0.3.5

- [patch][9d6f8d516a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d6f8d516a):

  - Adding expand link support to Atlassian Switcher

## 0.3.4

- [patch][571ad59bb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/571ad59bb7):

  - Pacakge version and feature flag analytics

## 0.3.3

- [patch][9cf7af0d03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cf7af0d03):

  - Data provider analytics

## 0.3.2

- [patch][aacc698f07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aacc698f07):

  - Adds an analytics event to track atlassian switcher dissmisals using the triggerXFlow callback

## 0.3.1

- [patch][57f774683f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57f774683f):

  - Move @atlaskit/logo to peer dependencies

## 0.3.0

- [minor][68443e3d6f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68443e3d6f):

  - Opsgenie app switching support

## 0.2.3

- [patch][a041506c4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a041506c4d):

  - Fixes a bug in global-navigation caused due to a missing asset in atlassian-switcher

## 0.2.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.2.1

- [patch][94acafec27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94acafec27):

  - Adds the error page according to the designs.

## 0.2.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.1.4

- [patch][b08df363b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b08df363b7):

  - Add atlassian-switcher prefetch trigger in global-navigation

## 0.1.3

- [patch][269cd93118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/269cd93118):

  - Progressive loading and prefetch primitives

## 0.1.2

- [patch][6ca66fceac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ca66fceac):

  - Add enableSplitJira to allow multiple jira link displayed if there are jira products

## 0.1.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/drawer@3.0.0
  - @atlaskit/item@9.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/navigation@34.0.0
  - @atlaskit/theme@8.0.0

## 0.1.0

- [minor][6ee7b60c4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee7b60c4a):

  - Create generic switcher for satellite products

## 0.0.9

- [patch][e7fa9e1308](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7fa9e1308):

  - Fixing icon imports

## 0.0.8

- [patch][ebfdf1e915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfdf1e915):

  - Update sections and grouping according to updated designs

## 0.0.7

- [patch][8a70a0db9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a70a0db9f):

  - SSR compatibility fix

## 0.0.6

- [patch][3437ac9990](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3437ac9990):

  - Firing events according to minimum event spec

## 0.0.5

- [patch][9184dbf08b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9184dbf08b):

  - Fixing package.json issue with atlassian-switcher

## 0.0.4

- [patch][95d9a94bd0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95d9a94bd0):

  - Adding root index for atlassian-switcher

## 0.0.3

- [patch][b56ca0131d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b56ca0131d):

  - Attempting to fix flow issue where atlassian-switcher is not recognized

## 0.0.2

- [patch][235f937d66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/235f937d66):

  - Initial package release

## 0.0.1

- [patch][25921b9e50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25921b9e50):

  - Adding AtlassianSwitcher component
