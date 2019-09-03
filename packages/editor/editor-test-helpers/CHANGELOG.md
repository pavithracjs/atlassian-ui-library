# @atlaskit/editor-test-helpers

## 9.11.13

- Updated dependencies [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-core@112.44.2
  - @atlaskit/editor-common@40.0.0

## 9.11.12

### Patch Changes

- [patch][a05133283c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a05133283c):

  Add missing dependency in package.json

## 9.11.11

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.11.10

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 9.11.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.11.8

### Patch Changes

- [patch][a82d6088e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a82d6088e2):

  ED-4807 Use right cell type when spliting merged header cells

## 9.11.7

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

## 9.11.6

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/editor-core@112.41.6
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-test-helpers@25.0.0

## 9.11.5

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 9.11.4

### Patch Changes

- [patch][6874801bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6874801bc0):

  ED-7314 Added test helpers for comparing selections. Includes new builders for gap cursors.

## 9.11.3

- Updated dependencies [6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):
  - @atlaskit/editor-core@112.39.5
  - @atlaskit/adf-schema@3.0.0
  - @atlaskit/editor-common@39.17.0

## 9.11.2

### Patch Changes

- [patch][0bb88234e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bb88234e6):

  Upgrade prosemirror-view to 1.9.12

## 9.11.1

### Patch Changes

- [patch][ec8066a555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8066a555):

  Upgrade `@types/prosemirror-view` Typescript definitions to latest 1.9.x API

## 9.11.0

### Minor Changes

- [minor][d53c3e989f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d53c3e989f):

  Add selectCell helper

## 9.10.1

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 9.10.0

### Minor Changes

- [minor][c0ba9ee289](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0ba9ee289):

  set viewMediaClientConfig when properties change in MediaSingle node

  This fixes [ED-7269] + [FEF-8938]: issue with images not loading when the page transition from view to edit mode

## 9.9.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 9.9.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 9.9.2

### Patch Changes

- [patch][979464019f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/979464019f):

  ED-7073: fixed table clear cell not working (caused by `prosemirror-utils@0.9.3`)

## 9.9.1

### Patch Changes

- [patch][13ca42c394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13ca42c394):

  # use getAuthFromContext from media when a file if pasted from a different collection

  Now products can provide auth using **getAuthFromContext** on MediaClientConfig:

  ```
  import {MediaClientConfig} from '@atlaskit/media-core'
  import Editor from '@atlaskit/editor-core'

  const viewMediaClientConfig: MediaClientConfig = {
    authProvider // already exists
    getAuthFromContext(contextId: string) {
      // here products can return auth for external pages.
      // in case of copy & paste on Confluence, they can provide read token for
      // files on the source collection
    }
  }
  const mediaProvider: = {
    viewMediaClientConfig
  }

  <Editor {...otherNonRelatedProps} media={{provider: mediaProvider}} />
  ```

## 9.9.0

### Minor Changes

- [minor][f60618b0f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f60618b0f0):

  ED-5844 Adding media link UI to editor

## 9.8.0

### Minor Changes

- [minor][4a22a774a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a22a774a6):

  AUX-36 Add update support for extension handler

## 9.7.0

### Minor Changes

- [minor][d217a12e31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d217a12e31):

  ED-7056: Update prosemirror-utils, this enables us to replace selected nodes while inserting
  ED-6668: Adds a selected ring to all extensions

## 9.6.0

### Minor Changes

- [minor][143dcb8704](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/143dcb8704):

  ED-2362 Add keyboard shortcuts for headings and normal text

## 9.5.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/editor-common@39.13.2
  - @atlaskit/editor-core@112.25.3
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/smart-card@12.2.3
  - @atlaskit/icon@19.0.0

## 9.5.1

### Patch Changes

- [patch][4c0fcec857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0fcec857):

  ED-7059: fix trailing slashes for hyperlinks being removed, and smart links resolving

## 9.5.0

### Minor Changes

- [minor][d6c31deacf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c31deacf):

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition input improvements

## 9.4.2

### Patch Changes

- [patch][bb64fcedcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb64fcedcb):

  uploadContext and viewContext fields of MediaProvider (part of Editor and Renderer props) are deprecated. New fields uploadMediaClientConfig and viewMediaClientConfig should be used from now on.

## 9.4.1

- Updated dependencies [393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):
  - @atlaskit/editor-core@112.14.0
  - @atlaskit/smart-card@12.0.0

## 9.4.0

### Minor Changes

- [minor][11a8112851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a8112851):

  ED-6991 Fire analytics event for renderer started

  Set up analytics v3 in renderer

## 9.3.9

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/editor-common@39.7.2
  - @atlaskit/editor-core@112.11.20
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/smart-card@11.1.6
  - @atlaskit/icon@18.0.0

## 9.3.8

### Patch Changes

- [patch][9503b9d220](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9503b9d220):

  Bump prosemirror table to latest version where performance improvement applies, related to celsInRect helper

## 9.3.7

- [patch][c59bd5d01e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c59bd5d01e):

  ED-6349: fix external images (often via copy paste) not having correct dimensions

## 9.3.6

- [patch][b567c44b93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b567c44b93):

  ED-6986: put cursor after smart link insertion if skipping macro

## 9.3.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 9.3.4

- [patch][9cbd059bfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd059bfa):

  - Put `media-editor` into separate editor plugin, update `@atlaskit/media-editor` API

  ### Breaking change for `@atlaskit/media-editor`

  - Make `onUploadStart`, `onFinish` optional
  - Add new `onClose` callback for when the user closes the dialog (escape, cancel, error)
  - `onFinish` now only called when the upload itself finishes, not overloaded for other purposes

    - now also passes the `FileIdentifier` of the completed upload

  ### Editor changes

  Adds a new `media-editor` plugin that is enabled if the media plugin is enabled and `allowAnnotation` is enabled on the `media` prop.

  This replaces the implementation inside the existing `media` plugin. The new `media-editor` plugin is _not_ dependent on the `media` plugin.

- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/editor-core@112.11.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-test-helpers@24.0.0

## 9.3.3

- [patch][7eca61edf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7eca61edf0):

  - ED-6965: bump prosemirror-utils to allow safeInsert replacing selected nodes when it conforms to schema

## 9.3.2

- [patch][7ce86bae14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ce86bae14):

  - Shift selection for rows and columns

## 9.3.1

- [patch][ed02efdb94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed02efdb94):

  - [ED-6817] Extract the current toggleHeader logic to prosemirror-table 0.8.0

## 9.3.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 9.2.0

- [minor][dfc7aaa563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfc7aaa563):

  - ED-6863: Fix the rendering of extensions in the renderer when they have breakout layouts.

## 9.1.5

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 9.1.4

- Updated dependencies [5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):
  - @atlaskit/editor-core@112.0.0

## 9.1.3

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/editor-core@111.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 9.1.2

- Updated dependencies [154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):
  - @atlaskit/editor-core@111.0.0

## 9.1.1

- [patch][652ef1e6be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/652ef1e6be):

  - ED-6774: Adds a FF to priortize smart links resolution over Jira Issue Macro

## 9.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 9.0.1

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 8.0.8

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/editor-core@109.0.0
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 8.0.7

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/editor-core@108.0.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 8.0.6

- [patch][5d9455978b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d9455978b):

  - ED-5292: add support for custom autoformatting

  You can now use the `customAutoformatting` prop to provide a custom autoformatting handler that replaces on particular regex strings.

  See (Editor RFC 131: Injectable auto-formatting rules, AutoformattingProvider)[https://product-fabric.atlassian.net/wiki/spaces/E/pages/881141566/Editor+RFC+131+Injectable+auto-formatting+rules+AutoformattingProvider] for more details on how this works.

  An example provider `autoformattingProvider` that is used in the storybook example is exported from the `@atlaskit/editor-test-helpers` package. Try typing ED-123.

  A simplified provider might look like:

      export const autoformattingProvider: AutoformattingProvider = {
        getRules: () =>
          Promise.resolve({
            '[Ee][Dd]-(\\d+)': (match: string[]): Promise<ADFEntity> => {
              const ticketNumber = match[1];
              return new Promise.resolve({
                type: 'inlineCard',
                attrs: {
                  url: 'https://www.atlassian.com/',
                },
              });
            },
          }),
      };

  At the moment, only text or `inlineCard` nodes are permitted to be replaced.

## 8.0.5

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 8.0.4

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 8.0.3

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/editor-core@107.0.0
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 8.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 8.0.1

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 8.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 7.0.6

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-core@105.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-core@28.0.0

## 7.0.5

- Updated dependencies [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/editor-core@104.0.0

## 7.0.4

- [patch][60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):

  - ED-6286: remove StateManager from media plugin and provider

## 7.0.3

- [patch][7a8d8ba656](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a8d8ba656):

  - ED-6452: Validate documents on init through collab-editing

  * Add unsupportedInline and unsupportedBlock to test-helpers.

## 7.0.2

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/editor-core@102.0.0
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0

## 7.0.1

- Updated dependencies [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/editor-core@101.0.0

## 7.0.0

- [major][4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):

  - Remove linkCreateContext from MediaProvider

## 6.3.22

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/editor-core@99.0.0
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 6.3.21

- [patch][fa435d11f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa435d11f7):

  - ED-6155 Fire analytics v3 events for general editor UI events

## 6.3.20

- [patch][09696170ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09696170ec):

  - Bumps prosemirror-utils to 0.7.6

## 6.3.19

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 6.3.18

- [patch][e5a98ed46b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5a98ed46b):

  - ED-6104: refactor createEditor to correctly call editorView.destroy() afterEach test

## 6.3.17

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-core@98.0.0
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-core@27.0.0

## 6.3.16

- [patch][4552e804d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4552e804d3):

  - dismiss StatusPicker if status node is not selected

## 6.3.15

- [patch][ccc39ca887](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccc39ca887):

  - ED-6094: add table CellSelection test helpers

## 6.3.14

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/editor-core@97.1.3
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-test-helpers@20.0.0

## 6.3.13

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/editor-common@30.0.1
  - @atlaskit/editor-core@97.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/smart-card@9.4.1
  - @atlaskit/icon@16.0.0

## 6.3.12

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/editor-core@97.0.0
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 6.3.11

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/editor-core@96.0.0
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0

## 6.3.10

- [patch][8158fe0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8158fe0):

  - ED-6059: Extension and inlineExtension should read their content from attrs not the PMNode.

## 6.3.9

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 6.3.8

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-common@28.0.2
  - @atlaskit/editor-core@95.0.0

## 6.3.7

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-core@94.0.0
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-core@26.0.0

## 6.3.6

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-core@93.0.0
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 6.3.5

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/editor-common@26.0.0
  - @atlaskit/editor-core@92.0.19

## 6.3.4

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/editor-core@92.0.0
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 6.3.3

- [patch][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 6.3.2

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/editor-core@91.0.0
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 6.3.1

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 6.3.0

- [minor][a1b03d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b03d0):

  - ED-3890 Adds Indentation support on paragraphs and headings

## 6.2.24

- [patch][94094fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94094fe):

  - Adds support for links around images

## 6.2.23

- Updated dependencies [3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):
  - @atlaskit/editor-core@90.0.0

## 6.2.22

- Updated dependencies [df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):
  - @atlaskit/editor-core@89.0.7
  - @atlaskit/smart-card@9.0.0

## 6.2.21

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/smart-card@8.8.5
  - @atlaskit/editor-common@22.0.2
  - @atlaskit/editor-core@89.0.6
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/icon@15.0.0

## 6.2.20

- [patch][a2cae0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2cae0c):

  - Fix conversion of pasted urls via macroPlugin with html in clipboard (ED-5786)

## 6.2.19

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/editor-core@89.0.0
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 6.2.18

- [patch][16ff8d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16ff8d2):

  - Add jira card editor example.

## 6.2.17

- [patch][14477fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14477fa):

  - Adding text alignment to editor and renderer

## 6.2.16

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/editor-core@88.0.0
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 6.2.15

- [patch][a9eb99f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9eb99f):

  - ED-5510: fix deleting last character in a cell in Safari

## 6.2.14

- [patch][798cff1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/798cff1):

  - Adds an Import option in full-page example

## 6.2.13

- [patch][7fc0ffb" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fc0ffb"
  d):

  - ED-5619 Change "Loren ipsun" to "Lorem ipsum" in the example

## 6.2.12

- [patch][44d9c5b" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44d9c5b"
  d):

  - ED-5632: mock Selection API globally; allows dispatching before Editor finishes mounting

## 6.2.11

- [patch][1662ae0" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1662ae0"
  d):

  - ED-5440 convert sections to use percentages

## 6.2.10

- [patch] ED-5439: add block smart cards, toolbar switcher [5f8bdfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f8bdfe)

## 6.2.9

- [patch] Wrap invalid node with unsupported node [fb60e39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb60e39)

## 6.2.8

- [patch] Updated dependencies [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)
  - @atlaskit/editor-core@87.0.0
  - @atlaskit/editor-common@20.1.2

## 6.2.7

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/editor-core@86.0.0
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 6.2.6

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/editor-core@85.0.0
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 6.2.5

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/editor-core@84.0.0
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 6.2.4

- [patch] Updated dependencies [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)
  - @atlaskit/editor-core@83.0.0

## 6.2.3

- [patch] change grey to gray to keep consistent across editor pkgs [1b2a0b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b2a0b3)

## 6.2.2

- [patch] ED-5424: fix telepointers in collab editing [643a860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/643a860)

## 6.2.1

- [patch] ED-5151 Editor i18n: Floating toolbars [403b547](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/403b547)

## 6.2.0

- [minor] FS-2893 - Creation use cases for full page actions and decisions [c8aa5f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8aa5f5)

## 6.1.3

- [patch] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 6.1.2

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/editor-core@81.0.0
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 6.1.1

- [patch] ED-5346: prosemirror upgrade [5bd4432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bd4432)

## 6.1.0

- [minor] FS-2961 Introduce status component and status node in editor [7fe2b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe2b0a)

## 6.0.9

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/editor-core@80.0.0
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 6.0.8

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-core@23.1.1
  - @atlaskit/editor-common@15.0.7
  - @atlaskit/editor-core@79.0.12

## 6.0.7

- [patch] ED-4680 add smart card plugin, enable for inline smart cards [b9529e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9529e6)

## 6.0.6

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/editor-core@79.0.0
  - @atlaskit/media-core@23.1.0

## 6.0.5

- [patch] Remove new upload service feature flag (useNewUploadService). Now new upload service will be used by default. [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-core@23.0.2
  - @atlaskit/editor-core@78.0.0

## 6.0.4

- [patch] Check current selected nodes before change node selection when interacting with extensions. ED-5199 [bb15908](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb15908)

## 6.0.3

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/editor-common@14.0.11
  - @atlaskit/editor-core@77.1.4

## 6.0.2

- [patch] ED-5178: added card node to default schema [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
- [none] Updated dependencies [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
  - @atlaskit/editor-core@77.0.13
  - @atlaskit/editor-common@14.0.8

## 6.0.1

- [patch] add useMediaPickerAuthProvider option to storyMediaProviderFactory [16971e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16971e9)
- [none] Updated dependencies [16971e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16971e9)
  - @atlaskit/editor-common@14.0.7

## 6.0.0

- [major] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-core@77.0.0
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-core@23.0.0
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-core@77.0.0

## 5.1.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/editor-core@76.4.5
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1

## 5.1.1

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/editor-common@13.2.6
  - @atlaskit/editor-core@76.4.2

## 5.1.0

- [minor] Updated dependencies [25ef2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25ef2e4)
  - @atlaskit/editor-core@76.4.0

## 5.0.3

- [patch] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-core@22.1.0
  - @atlaskit/editor-common@13.2.1
  - @atlaskit/editor-core@76.2.3

## 5.0.2

- [patch] Fallback to use containerId from MentionResourceConfig if ContextIdentifier promise fails [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)

- [none] Updated dependencies [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
  - @atlaskit/editor-core@76.0.4
  - @atlaskit/editor-common@13.0.4
- [none] Updated dependencies [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
  - @atlaskit/editor-core@76.0.4
  - @atlaskit/editor-common@13.0.4

## 5.0.1

- [none] Updated dependencies [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
  - @atlaskit/editor-core@76.0.0
- [patch] Updated dependencies [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
  - @atlaskit/editor-core@76.0.0

## 5.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0

## 4.2.4

- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-common@12.0.0
- [patch] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-common@12.0.0

## 4.2.3

- [none] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/editor-core@74.0.16
  - @atlaskit/editor-common@11.4.6
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/editor-core@74.0.16
  - @atlaskit/editor-common@11.4.6
- [none] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/editor-core@74.0.16
  - @atlaskit/editor-common@11.4.6

## 4.2.2

- [patch] Updated dependencies [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
  - @atlaskit/editor-core@74.0.0

## 4.2.1

- [none] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
  - @atlaskit/editor-core@73.9.26
  - @atlaskit/editor-common@11.3.12
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-core@21.0.0
  - @atlaskit/editor-common@11.3.12
  - @atlaskit/editor-core@73.9.26

## 4.2.0

- [minor] Export 'clean' function from schema-builder to allow converting RefNodes to normal PM nodes [2625ade](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2625ade)

* [none] Updated dependencies [2625ade](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2625ade)
  - @atlaskit/editor-core@73.9.8
  - @atlaskit/editor-common@11.3.9
* [none] Updated dependencies [e3c6479](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3c6479)
  - @atlaskit/editor-core@73.9.8
  - @atlaskit/editor-common@11.3.9
* [none] Updated dependencies [541341e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541341e)
  - @atlaskit/editor-core@73.9.8
  - @atlaskit/editor-common@11.3.9
* [none] Updated dependencies [fe383b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe383b4)
  - @atlaskit/editor-core@73.9.8
  - @atlaskit/editor-common@11.3.9

## 4.1.9

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/editor-common@11.3.8
  - @atlaskit/editor-core@73.9.5

## 4.1.8

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/editor-core@73.9.2
  - @atlaskit/editor-common@11.3.7

## 4.1.7

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/editor-common@11.3.5
  - @atlaskit/editor-core@73.8.19
  - @atlaskit/media-core@20.0.0

## 4.1.6

- [patch] Introduce regression tests for pasting content from 3rd-party vendors into the editor. `dispatchPasteEvent` now returns the event that was fired when successful, to allow consumers to tell whether it was modified by ProseMirror. (ED-3726) [e358e9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e358e9f)
- [none] Updated dependencies [e358e9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e358e9f)
  - @atlaskit/editor-core@73.8.11

## 4.1.5

- [patch] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [patch] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/editor-common@11.3.0
  - @atlaskit/editor-core@73.8.6

## 4.1.4

- [patch] Bump prosemirror-view to 1.3.3 to fix issue where newlines in code-blocks would vanish in IE11. (ED-4830) [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
- [none] Updated dependencies [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
  - @atlaskit/editor-core@73.8.3
  - @atlaskit/editor-common@11.2.10

## 4.1.3

- [patch] ED-4489 Fix can't submit with enter using Korean and Japanese IME [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
- [none] Updated dependencies [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
  - @atlaskit/editor-core@73.7.8
  - @atlaskit/editor-common@11.2.3

## 4.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/editor-core@73.7.5
  - @atlaskit/editor-common@11.2.1
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3

## 4.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/editor-core@73.7.1
  - @atlaskit/editor-common@11.1.2
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2

## 4.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-core@73.5.0
  - @atlaskit/editor-common@11.1.0
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/editor-common@11.1.0
  - @atlaskit/editor-core@73.5.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1

## 4.0.7

- [patch] Update and lock prosemirror-model version to 1.4.0 [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/editor-common@11.0.6
  - @atlaskit/editor-core@73.4.4

## 4.0.6

- [patch] Adding breakout to extensions [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
- [none] Updated dependencies [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
  - @atlaskit/editor-core@73.4.3
  - @atlaskit/editor-common@11.0.5

## 4.0.5

- [patch] ED-4823: added card provider [583ae09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583ae09)
- [none] Updated dependencies [583ae09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583ae09)
  - @atlaskit/editor-core@73.3.10

## 4.0.4

- [patch] ED-4818: add inlineCard to schema [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
- [none] Updated dependencies [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
  - @atlaskit/editor-core@73.3.7
  - @atlaskit/editor-common@11.0.4

## 4.0.3

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/editor-core@73.0.0
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0

## 4.0.2

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/editor-core@72.2.2
  - @atlaskit/editor-common@10.1.9

## 4.0.1

- [patch] Fixing the toolbar for extensions [ef9ccca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef9ccca)
- [none] Updated dependencies [ef9ccca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef9ccca)
  - @atlaskit/editor-core@72.1.4

## 4.0.0

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-core@72.0.0
  - @atlaskit/editor-common@10.0.0

## 3.1.9

- [patch] Allow disabling smart-autocompletion (capitalising of Atlassian products, em-dash insert, smart-quotes) via prop `textFormatting={{ disableSmartAutoCompletion: true }}` [cee7a4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cee7a4a)
- [none] Updated dependencies [cee7a4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cee7a4a)
  - @atlaskit/editor-core@71.4.2

## 3.1.8

- [patch] Support external media in bitbucket transformer and image uploader [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-core@71.4.0
  - @atlaskit/editor-common@9.3.9

## 3.1.7

- [patch] Extensions should have text [64e32a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64e32a2)

## 3.1.6

- [patch] Adding support for external images [9935105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9935105)

## 3.1.5

- [patch] ED-4431, selecting block extension creates a wrng selection. [c078cf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c078cf2)

## 3.1.4

- [patch] Bump to prosemirror-view@1.3.0 [faea319](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faea319)

## 3.1.2

- [patch] Handle pasting of page-layouts to prevent unpredictable node-splitting behaviour. Will now 'unwrap' the contents of a layout if the slice is a partial range across page layouts, or if we are attempting to paste a layout inside a layout. We now always handle dispatching the transaction to handle paste ourselves (instead of falling back to PM). [f4ca7ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4ca7ac)

## 3.1.0

- [minor] Add a generic type ahead plugin [445c66b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/445c66b)

## 3.0.8

- [patch] ED-4294: fix editing bodiedExtension nodes [35d2648](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2648)

## 3.0.7

- [patch] fix deletion of lists and other elements placed after tables; bump prosemirror-commands to 1.0.7 [162960f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/162960f)

## 3.0.4

- [patch] Remove old chai reference which does not allow using editor-test-helpers in non-atlaskit TS packages [ea627e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea627e4)

## 3.0.3

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 3.0.1

- [patch] change table node builder constructor for tests, remove tableWithAttrs [cf43535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf43535)

## 3.0.0

- [major] CFE-1004: Rename anything "macro" to "extension" (i.e: MacroProvider to ExtensionProvider) [453aa52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/453aa52)

## 2.1.1

- [patch] ED-3476 add table breakout mode [7cd4dfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cd4dfa)

## 2.0.14

- [patch] Show upload button during recents load in media picker. + Inprove caching for auth provider used in examples [929731a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/929731a)

## 2.0.13

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 2.0.12

- [patch] Remove JSDOM warning in CI [309af83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/309af83)

## 2.0.9

- [patch] CFE-846: Add support to extension handlers (lite version) [4ea9ffe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ea9ffe)

## 2.0.8

- [patch] restrict nested bodiedExtensions [2583534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2583534)

## 2.0.5

- [patch] support \_\_confluenceMetadata property on link mark [b17f847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b17f847)

## 2.0.2

- [patch] make colwidth an array of numbers in schema [369b522](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/369b522)

## 2.0.0

- [major] Remove linkCreateContext from default options and add userAuthProvider [fc2ca7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc2ca7a)

## 1.9.1

- [patch] Enforce minimum version of w3c-keyname to be >= 1.1.8 [dc120b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc120b9)

## 1.9.0

- [minor] add support for <fab:adf> and confluence decision list transforms [e08eccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e08eccc)
- [minor] add support for <fab:adf> and confluence decision list transforms [f43f928](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f43f928)
- [minor] advanced features for tables [e0bac20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0bac20)

## 1.8.11

- [patch] Encode and decode for Extension schemaVersion [0335988](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0335988)

## 1.8.10

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.8.9

- [patch] Fix issue with having multiple Dropzone elements listening at the same time with Editor and MediaPicker [d37de20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d37de20)

## 1.8.8

- [patch] Move media provider and state manager to editor-core [0601da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0601da7)

## 1.8.7

- [patch] bump editor-common to 6.1.2 [bb7802e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb7802e)

## 1.8.6

- [patch] Allow macro provider to handle auto conversion during paste [b2c83f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2c83f8)

## 1.8.5

- [patch] cket-transformer/**tests**/\_schema-builder.ts [a6e77ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6e77ff)

## 1.8.3

- [patch] fix extension replacement with empty content [e151446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151446)

## 1.8.1

- [patch] Remove placeholderBaseUrl config option from the Confluence Macro Provider [1583960](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1583960)

## 1.8.0

- [minor] added date plugin [f7b8a33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7b8a33)

## 1.7.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 1.6.1

- [patch] Use media-test-helpers instead of hardcoded values [f2b92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2b92f8)

## 1.4.5

- [patch] Add support for single image wrap left/right layout [59d9a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59d9a74)

## 1.4.0

- [minor] Add Serializer for Single image [03405bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03405bf)

## 1.3.0

- [minor] FS-1461 added ContextIdentifierProvider interface to editor [0aeea41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0aeea41)

## 1.2.6

- [patch] Rename singleImage to mediaSingle. Replaced alignment and display attributes with layout. [0b97f0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b97f0a)

## 1.2.2

- [patch] split extension node [4303d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4303d49)

## 1.1.2

- [patch] added extension node [ec73cb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec73cb8)

## 1.1.0

- [patch] Fix dependencies [9f9de42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f9de42)

## 0.8.1

- [patch] Restore accessLevel attribute for mention node [a83619f](a83619f)
