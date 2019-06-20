# @atlaskit/adf-schema

## 2.7.0

### Minor Changes

- [minor][0a7ce4f0e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a7ce4f0e6):

  ED-7046: promote layoutSection and layoutColumn from stage-0 to full schema

## 2.6.1

### Patch Changes

- [patch][aff59f9a99](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aff59f9a99):

  ED-7045: promote mediaSingle width attribute from stage-0 to full schema

## 2.6.0

### Minor Changes

- [minor][a6a241d230](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6a241d230):

  Breakout mark stage-0 -> full schema

## 2.5.10

### Patch Changes

- [patch][9886f4afa1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9886f4afa1):

  - [ED-7017] Improve table performance removing cellView from table

## 2.5.9

- [patch][f823890888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f823890888):

  - ED-6970: Fix backspacing inside a layout removing all content.

## 2.5.8

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 2.5.7

- [patch][1ec6367e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec6367e00):

  - ED-6551 - Lists should correctly wrap adjacent floated content without overlapping

## 2.5.6

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 2.5.5

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0

## 2.5.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

- [patch][0ac39bd2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ac39bd2dd):

  - Bump tslib to 1.9

## 2.5.3

- [patch][583f5db46d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583f5db46d):

  - Use tslib as dependency

## 2.5.2

- [patch][6695367885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695367885):

  - Revert emoji refactor

## 2.5.1

- [patch][c01f9e1cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01f9e1cc7):

  - Standardise code-block class between editor/renderer. Fix bg color when code-block is nested within a table heading.

## 2.5.0

- [minor][64dd2ab46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd2ab46f):

  - ED-6558 Fix clicking to set the cursor placement after an inline node that's at the end of a line. Set the default style attribute of Status nodes to be empty instead of 'null'.

## 2.4.1

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 2.4.0

- [minor][09a90e4af1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09a90e4af1):

  - ED-6319 Supporting select media using gap cursor, fix behaviour of backspace key and gap cursor in media single with layout wrap-right.

## 2.3.2

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 2.3.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 2.3.0

- [minor][02dd1f7287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd1f7287):

  - [ED-5505] Persists formatting to table cells and headers when toggling header row, column or applying any text formatting to empty cells.

## 2.2.1

- [patch][3f8a08fc88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f8a08fc88):

  Release a new version of adf-schema

## 2.2.0

- [minor][63133d8704](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63133d8704):

  - [ED-6200] Add defaultMarks attribute on tableCell schema

## 2.1.0

- [minor][0fea11af41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fea11af41):

  - Email renderer supports numbered columns, adf-schema extended with colors

## 2.0.1

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.7.1

- [patch][0825fbe634](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0825fbe634):

  - ED-6410: remove opacity from cells background color

## 1.7.0

- [minor][6380484429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6380484429):

  - ED-6485 Support breakout mark on layout-section. Retain breakout mark when toggling list nested within columns.

## 1.6.2

- [patch][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 1.6.1

- [patch][4d0c196597](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d0c196597):

  - ED-6232 Fix copy-pasting a table with numbered column drops one column

## 1.6.0

- [minor][3672ec23ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3672ec23ef):

  - [ED-5788] Add new layout Breakout button for CodeBlock and Layout

## 1.5.5

- [patch][356de07a87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/356de07a87):

  - Revert back to number for external media

## 1.5.4

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/editor-test-helpers@7.0.0

## 1.5.3

- [patch][775da616c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/775da616c6):

  - [ED-5910] Keep width & height on media node as number

## 1.5.2

- [patch][e83a441140](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e83a441140):

  - Revert type change to width/height attributes for media node

## 1.5.1

- [patch][09696170ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09696170ec):

  - Bumps prosemirror-utils to 0.7.6

## 1.5.0

- [minor][14fe1381ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14fe1381ba):

  - ED-6118: ensure media dimensions are always integers, preventing invalid ADF

## 1.4.6

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 1.4.5

- [patch][4552e804d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4552e804d3):

  - dismiss StatusPicker if status node is not selected

## 1.4.4

- [patch][adff2caed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adff2caed7):

  - Improve typings

## 1.4.3

- [patch][d10cf50721](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d10cf50721):

  - added fabric status to ADF full schema

## 1.4.2

- [patch][478a86ae8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/478a86ae8a):

  - avoid using the same localId when pasting status

## 1.4.1

- [patch][2d6d5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6d5b6):

  - ED-5379: rework selecting media under the hood; maintain size and layout when copy-pasting

## 1.4.0

- [minor][c5ee0c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5ee0c8):

  - Added Annotation mark to ADF, editor & renderer

## 1.3.3

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 1.3.2

- [patch][a50c114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a50c114):

  - ED-6026: unify attributes for blockCard and inlineCard; allow parseDOM using just 'data' attribute

## 1.3.1

- [patch][7d9ccd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d9ccd7):

  - fixed copy/paste status from renderer to editor

## 1.3.0

- [minor][cbcac2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbcac2e):

  - Promote smartcard nodes to full schema

## 1.2.0

- [minor][5b11b69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b11b69):

  - Allow mixed of cell types in a table row

## 1.1.0

- [minor][b9f8a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f8a8f):

  - Adding alignment options to media

## 1.0.1

- [patch][d7bfd60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7bfd60):

  - Rengenerate JSON schema after moving packages

## 1.0.0

- [major][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package
