- Put `media-editor` into separate editor plugin, update `@atlaskit/media-editor` API

### Breaking change for `@atlaskit/media-editor`

* Make `onUploadStart`, `onFinish` optional
* Add new `onClose` callback for when the user closes the dialog (escape, cancel, error)
* `onFinish` now only called when the upload itself finishes, not overloaded for other purposes

  * now also passes the `FileIdentifier` of the completed upload

### Editor changes

Adds a new `media-editor` plugin that is enabled if the media plugin is enabled and `allowAnnotation` is enabled on the `media` prop.

This replaces the implementation inside the existing `media` plugin. The new `media-editor` plugin is *not* dependent on the `media` plugin.