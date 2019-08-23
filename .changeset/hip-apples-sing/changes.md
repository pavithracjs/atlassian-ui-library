ED-5996: support viewing inline comments within editor

You can do this with the `annotationProvider` prop. Passing a truthy value to this (e.g. the empty object `{}`) will:

* enable support for working with the `annotation` ADF mark
* will render highlights around any annotations, and
* allow copying and pasting of annotations within the same document, or between documents

You can also optionally pass a React component to the `component`, so you can render custom components on top of or around the editor when the user's text cursor is inside an annotation.

Please see [the package documentation](https://atlaskit.atlassian.com/packages/editor/editor-core/docs/annotations) for more information.

There is an example component called `ExampleInlineCommentComponent` within the `@atlaskit/editor-test-helpers` package. It is currently featured in the full page examples on the Atlaskit website.

Annotations are styled within the editor using the `fabric-editor-annotation` CSS class.

Other changes: 

* `Popup` now supports an optional `rect` parameter to direct placement, rather than calculating the bounding client rect around a DOM node.