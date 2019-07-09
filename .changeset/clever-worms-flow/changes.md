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