# @atlaskit/media-ui

## 11.6.1

### Patch Changes

- [patch][6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):

  Deprecated props, `value` and `onValueUpdated` have been removed from the Badge component. Please use the children prop instead.

## 11.6.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 11.5.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 11.5.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 11.5.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 11.5.2

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-test-helpers@25.0.0

## 11.5.1

### Patch Changes

- [patch][d399d55637](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d399d55637):

  Move @types/bytes from dependencies to devDependencies.

## 11.5.0

### Minor Changes

- [minor][1c806932b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c806932b3):

  Following exported members are introduced: `findParentByClassname` function, `InactivityDetector` component to help with inactivity detection and hiding controls in inline video player and media viewer, `WithShowControlMethodProp` interface to combine type expectations.

## 11.4.7

### Patch Changes

- [patch][2d48433f3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d48433f3c):

  ED-7278: Adjust smart link icon height, when link is truncated the text after the link should now wrap correctly

## 11.4.6

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 11.4.5

### Patch Changes

- [patch][515427ad91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/515427ad91):

  fix: forbidden and unauthorised smartlinks act like <a> tags and no longer truncate their URLs

## 11.4.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 11.4.3

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

## 11.4.2

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/checkbox@9.0.0

## 11.4.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/avatar-group@4.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/icon@19.0.0

## 11.4.0

### Minor Changes

- [minor][53b1e6a783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53b1e6a783):

  Add a download button to inline video player to allow download of video binary

## 11.3.0

### Minor Changes

- [minor][fe6dbc5c49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe6dbc5c49):

  fix icon alignment for inline card.

## 11.2.9

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/avatar-group@4.0.4
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 11.2.8

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/avatar-group@4.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/icon@18.0.0

## 11.2.7

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 11.2.6

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 11.2.5

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0
  - @atlaskit/media-test-helpers@24.0.0

## 11.2.4

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/page@11.0.0

## 11.2.3

- [patch][391c93daf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/391c93daf7):

  - Prevents inline videos in Editor/Renderer to be played simulteneously in the same page

## 11.2.2

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/dropdown-menu@8.0.2
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 11.2.1

- [patch][1c9586e1a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c9586e1a0):

  - Reverted strings to the original format

## 11.2.0

- [minor][061eb57bab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/061eb57bab):

  - Added partial i18n support to media-ui

## 11.1.2

- [patch][6a52b3d258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a52b3d258):

  - fix for clicking behaviour in view/edit mode for Inline Smart Links.

## 11.1.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-test-helpers@23.0.0

## 11.1.0

- [minor][121c945cc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/121c945cc6):

  - fix padding, hover, icon for Inline Links.

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.1.11

- [patch][682279973f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/682279973f):

  - Changed Unauthorized and Errored inline view for smart cards to be text only and added color theming for smart link titles

## 10.1.10

- [patch][1a18876567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a18876567):

  - Changed behaviour so that icon and first 8 characters of a smart link no longer break when wrapping.

## 10.1.9

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 10.1.8

- [patch][687f535a12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/687f535a12):

  - Changed smart link selection in editor mode to not include text selection, but retain it in renderer mode

## 10.1.7

- [patch][cfec2f0b70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfec2f0b70):

  - Fixed a text selection bug for inline smart links

## 10.1.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 10.1.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/avatar-group@3.0.4
  - @atlaskit/badge@11.0.1
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-text@8.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 10.1.4

- [patch][bee4101a63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bee4101a63):

  - instrument analytics for audio and video play and error events

## 10.1.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/avatar-group@3.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/page@9.0.3
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 10.1.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 10.1.1

- [patch][106d046114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/106d046114):

  - Fix issue with media-viewer opening in CC on inline video player controlls clicked

## 10.1.0

- [minor][5d70c1ee30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d70c1ee30):

  - MediaImage component added (moved from @atlaskit/media-card). With extra fields: crossOrigin, onImageLoad, onImageError

## 10.0.5

- Updated dependencies [c95557e3ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95557e3ff):
  - @atlaskit/badge@11.0.0

## 10.0.4

- [patch][62834d5210](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62834d5210):

  - update dependency version of @atlaskit/spinner

## 10.0.3

- [patch][9b0dd21ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0dd21ce7):

  - allow the appearance of lozenges within smart link tasks to be configured

## 10.0.2

- [patch][aa117f5341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa117f5341):

  - fix alignment and UI for inline Smart Links.

## 10.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 10.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 9.2.3

- [patch][8ed53a1cbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ed53a1cbb):

  - fix padding, wrapping for inline smart links.

## 9.2.2

- [patch][be479e2335](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be479e2335):

  - fix link opening logic for view and edit mode.

## 9.2.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/avatar-group@3.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/badge@10.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/page@9.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 9.2.0

- [minor][b7ead07438](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7ead07438):

  - New messages to support media-editor changes

## 9.1.0

- [minor][41147bbc4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41147bbc4c):

  - Fix for links in editor

## 9.0.1

- [patch][9aa8faebd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aa8faebd4):

  - Added strict typing for i18n messages

## 9.0.0

- [major][d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):

  - Breaking change. ModalSpinner props has changed. now it's blankedColor: string and invertSpinnerColor: boolean

## 8.5.1

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 8.5.0

- [minor][be66d1da3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be66d1da3a):

  - Introduce ModalSpinner component to be used in modal type component while those loading via code split

## 8.4.2

- [patch][af3918bc89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af3918bc89):

  - The url part of the unauthorized link is now grey

## 8.4.1

- [patch][56c5a4b41f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c5a4b41f):

  - Fix "try again" should not be showing when there are no auth methods

## 8.4.0

- [minor][63e6f7d420](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63e6f7d420):

  - Fix missing attributes for link view

## 8.3.1

- [patch][bef9abc8de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bef9abc8de):

  - added background colour to inline card views, fixed icon alignment.

## 8.3.0

- [minor][89668941e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89668941e6):

  - Flip width and height around when image is on it's side according to metadata orientation; Introduce isRotated utility

## 8.2.6

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-test-helpers@20.0.0

## 8.2.5

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/avatar-group@2.1.10
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/icon@16.0.0

## 8.2.4

- [patch][e7100a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7100a8):

  - Minor tests realted changes

- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-test-helpers@19.0.0

## 8.2.3

- [patch][e6516fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6516fb):

  - Move media mocks into right location to prevent them to be included in dist

## 8.2.2

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 8.2.1

- [patch][9c50550](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c50550):

  - Do not show connect button if there are no auth methods.

## 8.2.0

- [minor][95f98cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f98cc):

  - User can click on a smart card to open a new window/tab

## 8.1.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/avatar-group@2.1.9
  - @atlaskit/badge@9.2.2
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/page@8.0.12
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 8.1.1

- [patch][e375b42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e375b42):

  - Update props description

## 8.1.0

- [minor][8fbb36f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fbb36f):

  - Change impl. of CustomVideoPlayer; add disableThumbTooltip property to TimeRange component; Add ability to mouse click and drag right away to TimeRange even if clicked outside of thumb control;

## 8.0.0

- [major][5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):

  - CustomVideoPlayer is now CustomMediaPlayer and supports audio through type property. Media Viewer now uses custom audio player for audio everywhere except IE11.

## 7.11.0

- [minor][01697a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01697a6):

  - CustomVideoPlayer improvements: fix currentTime origin + apply custom theme

## 7.10.0

- [minor][c1ea81c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1ea81c):

  - use custom video player for inline video in media-card

## 7.9.0

- [minor][c61f828](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c61f828):

  - add bounds to camera module

## 7.8.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/avatar-group@2.1.8
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/field-text@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/badge@9.2.1
  - @atlaskit/lozenge@6.2.3

## 7.8.1

- [patch][4c0c2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0c2a0):

  - Fix Cards throwing Error when client is not provided.

## 7.8.0

- [minor][5a6de24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a6de24):

  - translate component properties in media components

## 7.7.0

- [minor][df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):

  - Introduced pending state (which is represented as a link) and a race between resolving state and the data fetch.

## 7.6.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/avatar-group@2.1.7
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 7.6.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/avatar-group@2.1.6
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/page@8.0.11
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 7.6.0

- [minor][b9d9e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9d9e9a):

  - Support advanced i18n mode in MediaPicker

## 7.5.0

- [minor][2cac27f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cac27f):

  - InfiniteScroll component now triggers on load and on change (where is previously only onScroll event)

## 7.4.1

- [patch][a567cc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a567cc9):

  - Improve rendering of Smart Cards.

## 7.4.0

- [minor][b758737](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b758737):

  - add i18n support to media-avatar-picker

## 7.3.1

- [patch][941a687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/941a687):

  Bump i18n-tools and refactor to support babel-plugin-transform-typescript

## 7.3.0

- [minor][023cb45" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/023cb45"
  d):

  - Add i18n support to MediaViewer

## 7.2.1

- [patch][cf840fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf840fa):

  MS-1069 Use physical pixel dimensions to determine scale factor of PNG

## 7.2.0

- [minor][439dde6" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/439dde6"
  d):

  - rotate local image preview in cards based on the file orientation

## 7.1.1

- [patch][1aa57ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1aa57ab):

  Clean up for media up and new task converter for smart cards

## 7.1.0

- [minor] Added task converter [8678076](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8678076)

## 7.0.0

- [major] Update blockcard and inline card exports to be compatible with tree shaking. Preperation for asyncloading parts of smart card [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)

## 6.3.1

- [patch] parse floating values correctly for scaleFactor from filename [ecc0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecc0068)

## 6.3.0

- [minor] Add i18n support to MediaPicker [9add3a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9add3a4)

## 6.2.0

- [minor] add image metadata parsing to media-ui [3c42c4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c42c4d)

## 6.1.0

- [minor] Add pagination to recents view in MediaPicker [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 6.0.3

- [patch] Refactored the rxjs set up for smart cards [026c96e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026c96e)

## 6.0.2

- [patch] workaround to handle string size comming from /collection/items [8e99323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e99323)

## 6.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/avatar-group@2.1.3
  - @atlaskit/button@9.0.13
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 6.0.0

- [major] Add I18n support to media-card [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)

## 5.2.0

- [minor] Added `isSelected` to the `Card` component (inline resolved view) [6666d82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6666d82)

## 5.1.3

- [patch] fix borderRadiusBottom and borderRadius exports [f4fa1ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4fa1ac)

## 5.1.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/badge@9.1.1

## 5.1.1

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/button@9.0.6
  - @atlaskit/badge@9.1.0
  - @atlaskit/avatar-group@2.1.1
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 5.1.0

- [minor] Use Camera class in avatar picker [335ab1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/335ab1e)

## 5.0.4

- [patch] Make avatar group a caret dependency [aa24a6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa24a6c)
- [none] Updated dependencies [c7e484c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7e484c)
  - @atlaskit/avatar-group@2.0.6
  - @atlaskit/docs@5.0.3

## 5.0.3

- [patch] Updated dependencies [5b5bd8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b5bd8e)
  - @atlaskit/avatar-group@2.0.5

## 5.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/page@8.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/badge@9.0.3
  - @atlaskit/spinner@9.0.4
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar-group@2.0.4
  - @atlaskit/avatar@14.0.5

## 5.0.1

- [patch] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/field-text@7.0.2
  - @atlaskit/page@8.0.1
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/lozenge@6.1.2
  - @atlaskit/badge@9.0.2
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1
  - @atlaskit/dropdown-menu@6.1.3
  - @atlaskit/avatar-group@2.0.3
  - @atlaskit/avatar@14.0.4

## 5.0.0

- [major] Implemented smart cards and common views for other cards [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [major] Implemented smart cards and common UI elements [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [major] Implement smart card [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [major] Smart cards implementation and moved UI elements into media-ui package [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- [major] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-ui@5.0.0

## 4.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 3.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/icon@12.1.2

## 3.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 3.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/button@8.1.0

## 3.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 2.1.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 2.1.0

- [minor] Move toHumanReadableMediaSize to media-ui [b36c763](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36c763)

## 2.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.1.6

- [patch] fixed missing and inccorect versions of dependencies [7bfbb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bfbb09)

## 1.1.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 1.1.1

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 1.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.0.1

- [patch] Introduce media-ui package [39579e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39579e2)
