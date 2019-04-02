- ED-6598: Toggling `fullWidthMode` now re-creates `EditorView` instead of only re-creating `EditorState`

This enables us to call updates on contentComponents and nodeViews
