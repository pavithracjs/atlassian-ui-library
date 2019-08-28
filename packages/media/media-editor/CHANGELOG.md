# @atlaskit/media-editor

## 36.3.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 36.2.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 36.2.12

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 36.2.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 36.2.10

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-store@12.0.9
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 36.2.9

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-client@2.0.1
  - @atlaskit/media-store@12.0.8
  - @atlaskit/media-ui@11.5.2
  - @atlaskit/media-test-helpers@25.0.0

## 36.2.8

### Patch Changes

- [patch][6ad542fe85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ad542fe85):

  Adding try/catch in async imports for @atlaskit/media-avatar-picker, @atlaskit/media-card, @atlaskit/media-editor, @atlaskit/media-viewer

## 36.2.7

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-store@12.0.6
  - @atlaskit/media-test-helpers@24.3.5
  - @atlaskit/media-client@2.0.0

## 36.2.6

### Patch Changes

- [patch][d4d48c4ede](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4d48c4ede):

  Update package.json with a correct script to copy binaries in both esm and cjs. Adding a check to make sure those folders exits after being built.

## 36.2.5

### Patch Changes

- [patch][22bbf51cea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22bbf51cea):

  change copy-binaries script to move media-editor binaries into right destination

## 36.2.4

### Patch Changes

- [patch][6e7c111cc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e7c111cc6):

  Fixing binaries import for cjs

## 36.2.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 36.2.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 36.2.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/media-card@63.3.1
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/icon@19.0.0

## 36.2.0

### Minor Changes

- [minor][bdf6e42a32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdf6e42a32):

  Undo and Redo actions (using keyboard shortcuts) are introduced.

## 36.1.2

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/media-ui@11.2.9
  - @atlaskit/tooltip@15.0.0

## 36.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/media-card@63.1.5
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 36.1.0

### Minor Changes

- [minor][18a4cda21f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18a4cda21f):

  - You can supply mediaClientConfig instead of Context to SmartMediaEditor component. Soon Context input will be deprecated and removed.

## 36.0.2

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/modal-dialog@10.0.3
  - @atlaskit/inline-dialog@12.0.0

## 36.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 36.0.0

- [patch][92381960e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92381960e9):

  - Updated types to support modal-dialog typescript conversion

- [major][9cbd059bfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd059bfa):

  - Put `media-editor` into separate editor plugin, update `@atlaskit/media-editor` API

  ### Breaking change for `@atlaskit/media-editor`

  - Make `onUploadStart`, `onFinish` optional
  - Add new `onClose` callback for when the user closes the dialog (escape, cancel, error)
  - `onFinish` now only called when the upload itself finishes, not overloaded for other purposes

    - now also passes the `FileIdentifier` of the completed upload

  ### Editor changes

  Adds a new `media-editor` plugin that is enabled if the media plugin is enabled and `allowAnnotation` is enabled on the `media` prop.

  This replaces the implementation inside the existing `media` plugin. The new `media-editor` plugin is _not_ dependent on the `media` plugin.

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/button@13.0.4
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-ui@11.2.5
  - @atlaskit/spinner@12.0.0
  - @atlaskit/icon@17.1.2
  - @atlaskit/modal-dialog@10.0.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-store@12.0.2
  - @atlaskit/media-test-helpers@24.0.0

## 35.0.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-store@12.0.1
  - @atlaskit/media-ui@11.1.1
  - @atlaskit/media-test-helpers@23.0.0

## 35.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/media-card@63.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/field-range@7.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/inline-dialog@11.0.0
  - @atlaskit/modal-dialog@9.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/tooltip@14.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-store@12.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/media-ui@11.0.0

## 34.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 33.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 32.0.7

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 32.0.6

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/media-card@60.0.3
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/theme@8.1.7

## 32.0.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-store@11.0.7
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 32.0.4

- [patch][5ceba058c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ceba058c9):

  - MS-1613 Media Editor should close by Esc press without closing Media Picker

## 32.0.3

- Updated dependencies [0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):
  - @atlaskit/media-core@29.1.2
  - @atlaskit/media-store@11.0.5
  - @atlaskit/media-test-helpers@21.2.2
  - @atlaskit/media-card@60.0.0

## 32.0.2

- [patch][4eda8dd947](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eda8dd947):

  - Do not grag existing object when try to draw on top of them. Single click still selects an object

## 32.0.1

- [patch][e2453a0071](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2453a0071):

  - MS-1749 Always pass occurrenceKeys during file creation to avoid file being inserted in the collection twice

## 32.0.0

- [patch][c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):

  - Fix missing annotated images in recent uploads within media picker

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 31.0.3

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-store@11.0.2
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-card@58.0.0

## 31.0.2

- [patch][09f9c0c698](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09f9c0c698):

  - Bug fixes around focus geting back to editor and UI fixes around dark theme, line thickness picker and color picker (which now uses ADG colors)

## 31.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 31.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/media-card@57.0.0
  - @atlaskit/button@11.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-store@11.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/media-ui@10.0.0

## 30.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 29.1.3

- [patch][7b2510da6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b2510da6c):

  - Revert "use esm instead of cjs in MediaEditor.js bundle"

## 29.1.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/inline-dialog@10.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0

## 29.1.1

- [patch][cd7ed32895](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd7ed32895):

  - use esm instead of cjs in MediaEditor.js bundle

## 29.1.0

- [minor][d6a3c8ec43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6a3c8ec43):

  - Numerous UI/UX improvements also dimensions as a second argument in onUploadStart callback

## 29.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 28.0.0

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 27.0.4

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-store@9.1.6
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-card@53.0.0

## 27.0.3

- [patch][87a9c70162](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a9c70162):

  - Update use of ModalSpinner component

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-card@52.0.4
  - @atlaskit/media-test-helpers@20.1.2
  - @atlaskit/media-ui@9.0.0

## 27.0.2

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 27.0.1

- [patch][9df2a5bd88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9df2a5bd88):

  - Use media-ui's ModalSpinner

## 27.0.0

- [major][79e21779d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79e21779d4):

  - Remove export of Props and State types for EditorView and SmartMediaEditor.
  - Make both EditorView and SmartMediaEditor export async component.
  - Remove export of types from ./common

## 26.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 25.0.2

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-card@51.0.2
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-store@9.1.4
  - @atlaskit/media-ui@8.2.6
  - @atlaskit/media-test-helpers@20.0.0

## 25.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/icon@16.0.0

## 25.0.0

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 24.0.0

- [major][f9796df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9796df):

  - Numerous changes, main one introduction of SmartMediaEditor.

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-store@9.1.2
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0
  - @atlaskit/media-ui@8.2.4

## 23.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-core@26.0.0

## 22.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 21.0.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 21.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 20.0.0

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 19.0.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/icon@15.0.2
  - @atlaskit/media-core@24.5.2
  - @atlaskit/docs@6.0.0

## 19.0.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/icon@15.0.0

## 19.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 18.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 17.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 16.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 15.0.0

- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 14.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/icon@14.0.0

## 14.0.0

- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 13.0.1

- [patch] Use stricter tsconfig [3e3a10d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e3a10d)

## 13.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 12.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/media-core@23.1.0

## 11.0.1

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-core@23.0.2

## 11.0.0

- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-core@23.0.0

## 10.0.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/docs@5.0.2

## 10.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 9.1.4

- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-core@21.0.0

## 9.1.3

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-core@20.0.0

## 9.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/icon@12.1.2

## 9.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/icon@12.1.1
  - @atlaskit/docs@4.1.1

## 9.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1

## 9.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/docs@4.0.0

## 8.0.2

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-core@18.1.2

## 8.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1

## 8.0.0

- [major] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0

## 7.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-test-helpers@12.0.4
  - @atlaskit/media-core@18.0.3
  - @atlaskit/docs@3.0.4

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.0.6

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 4.2.3

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 4.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.1.1

- [patch] Update MediaEditor bundle to remove crypto module usage [3a779d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a779d8)

## 4.1.0

- [minor] Improve mediaEditor core bundle binaries; reducing bundle size, es2015 usage and remave it to mediaEditor [91c1ce1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91c1ce1)

## 4.0.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.0.1

- [patch] Fix eidtorCore binary [add6f5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/add6f5f)

## 3.4.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.3.6

- [patch] Copy binaries into dist folder when building media-editor [a82d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a82d5da)

## 3.3.2

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)
- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)
