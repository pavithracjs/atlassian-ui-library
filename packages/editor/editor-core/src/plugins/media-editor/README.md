# Purpose

This plugin handles displaying the media editor from `@atlaskit/media-editor`
so users can annotate their images.

It is opened by annotate button on the media toolbar on the selected media
node.

# User Flow

    ready       -> editing      -> uploading

    can open       user is         image is being
    editor         annotating      uploaded, replace the node
                   image at        at the position and
                   position        hide the dialog.


                -> error/cancel
                  
                   close dialog