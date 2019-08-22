## Editor Azlon Release

### Affected editor components:

Tables, Media, Smart Cards, Extensions, Analytics, Copy and Paste, Code Block, Undo, Emoji

### Performance

- Reduce number of wrapping nodes in table cells. – [table][affects: wrapping, overflow, resizing]
  - https://product-fabric.atlassian.net/browse/ED-7288
- Cache resizeState in pluginState to avoid expensive DOM operations. – [table][affects: resizing]
  - https://product-fabric.atlassian.net/browse/ED-7343
- Delay MutationObserver initialization in table. – [table][affects: initial table rendering, size adjustment on initial render]
  - https://product-fabric.atlassian.net/browse/ED-7436
- Improve the way we handle mouse events in table – [table][affects: column drag handlers, table controls, resizing]
  - https://product-fabric.atlassian.net/browse/ED-7342

### SmartCards

- Pending and error states do not pass onClick prop
  - https://product-fabric.atlassian.net/browse/SL-359
- Make toolbars consistent between blue link and smart link – [affects: link and smart link]
  - https://product-fabric.atlassian.net/browse/ED-7157

### Mention Highlights

Not clear how to test. – [affects: all type aheads, mention type ahead]

### Emoji Refactor

Emoji has been rewritten to use common TypeAhead plugin (same as quick insert and mention). Need to thoroughly look at emoji typeahead, e.g. typing ":" and inserting emojis...

- https://product-fabric.atlassian.net/browse/ED-5369

### Copy and Paste

- Copying text & images from Google doc changes formatting on paste [affects: media]
  - https://product-fabric.atlassian.net/browse/ED-7338
- Pasted code block does not persist selected language – [affects: code block]
  - https://product-fabric.atlassian.net/browse/ED-7050
- Copy and paste media

### Tables

- Table add 40+ blank columns
  - https://product-fabric.atlassian.net/browse/ED-7031
- Implement Table Sorting in Edit Mode – [NEW BIG FEATURE][not enabled]
  - Feature flag:
    - allowColumnSorting – [default: false]
  - https://product-fabric.atlassian.net/browse/ED-7391

### Analytics

- Fire undo events – [affects: undo]
  - https://product-fabric.atlassian.net/browse/ED-7276
- Make all insert events set analytics meta
  - https://product-fabric.atlassian.net/browse/ED-7277

### Notable Bug fixes

- Issue with ctrl+z [affects: undo on different languages, e.g. Russian keyboard]
  - https://product-fabric.atlassian.net/browse/ED-7310
