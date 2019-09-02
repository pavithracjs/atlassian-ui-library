## 0.1.0

## 0.15.0

### Minor Changes

- [minor][eb130ee556](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb130ee556):

  Added analytics event to onclick event in ArticleListItem

## 0.14.5

### Patch Changes

- [patch][9c28ef71fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c28ef71fe):

  Add missing peerDependency in package.json

## 0.14.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.14.3

### Patch Changes

- [patch][9e23c34ccb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e23c34ccb):

  Use generic types instead of type annotations for styles-components

## 0.14.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.14.1

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

## 0.14.0

### Minor Changes

- [minor][30d333543b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30d333543b):

  Fixed articles navigation

## 0.13.1

### Patch Changes

- [patch][95cbef78d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95cbef78d5):

  Updated ArticleListItem Title color

## 0.13.0

### Minor Changes

- [minor][5141af87be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5141af87be):

  Updated design and expose ArticleListItem

## 0.12.0

### Minor Changes

- [minor][7880462487](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7880462487):

  Updated design. Added new props related to feedback from

## 0.11.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 0.11.3

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

## 0.11.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/form@6.1.1
  - @atlaskit/item@10.0.5
  - @atlaskit/navigation@35.1.8
  - @atlaskit/radio@3.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/quick-search@7.5.1
  - @atlaskit/icon@19.0.0

## 0.11.1

- Updated dependencies [07c2c73a69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07c2c73a69):
  - @atlaskit/help-article@0.5.0

## 0.11.0

### Minor Changes

- [minor][a9001be8fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9001be8fd):

  Updated examples. Renamed component and references from help-panel to help

## 0.9.0

### Minor Changes

- [minor][ed8ef1f7af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed8ef1f7af):

  updated help-article version and fix some IE11 CSS issues

## 0.8.5

### Patch Changes

- [patch][0f869bb237](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f869bb237):

  fix loading error state

## 0.8.4

### Patch Changes

- [patch][2870381e09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2870381e09):

  fix IE11 styles issues

## 0.8.3

### Patch Changes

- [patch][e4ecf9b50e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4ecf9b50e):

  Fix CSS issues. Display loading state only 1000ms after the request was made

## 0.8.2

### Patch Changes

- [patch][4534dc3d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4534dc3d51):

  Fix for dependency on @atlaskit/tooltip

## 0.8.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/form@6.0.5
  - @atlaskit/item@10.0.2
  - @atlaskit/navigation@35.1.5
  - @atlaskit/radio@3.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/quick-search@7.4.1
  - @atlaskit/icon@18.0.0

## 0.8.0

### Minor Changes

- [minor][26759e6bf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26759e6bf3):

  Updated help-article version

## 0.7.0

### Minor Changes

- [minor][91136c9a7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91136c9a7a):

  Added loading and error state

## 0.6.0

### Minor Changes

- [minor][6fa3249843](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fa3249843):

  Added tooltip and hover state to close button. Updated panel width

## 0.5.8

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 0.5.7

- Updated dependencies [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/form@6.0.3
  - @atlaskit/radio@3.0.0

## 0.5.6

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/navigation@35.1.3
  - @atlaskit/page@11.0.0

## 0.5.5

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/form@6.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/navigation@35.1.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/help-article@0.4.4
  - @atlaskit/section-message@4.0.0

## 0.5.4

- [patch][84b7ee2f8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84b7ee2f8b):

  - fix articles loading when the articleId changes

## 0.5.3

- [patch][45f063521d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45f063521d):

  - Updated dependencies

## 0.5.2

- [patch][d1854796ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1854796ae):

  - Updated dependencies

## 0.5.1

- [patch][ccacfe8570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccacfe8570):

  - Updated help-article version

## 0.5.0

- [minor][88b9f3568b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88b9f3568b):

  - Update transition configuration of the panel. If the initial value of isOpen is true, fire analytics event and request the article

## 0.4.2

- [patch][4053dcd740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4053dcd740):

  - added close button and styles for header when the component renders the default content

## 0.4.1

- [patch][a77b18b718](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a77b18b718):

  - fix - Display DefaultContent

## 0.4.0

- [minor][f479974eb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f479974eb4):

  - Added version.json and update analytics.json to read the info from there

## 0.3.0

- [minor][875ff270e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/875ff270e8):

  - Use @atlaskit/help-article instead of custom component

## 0.2.0

- [minor][e6b180d4cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b180d4cd):

  - First release of global-help

- [major] First release of global-help
