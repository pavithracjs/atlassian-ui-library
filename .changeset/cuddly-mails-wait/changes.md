Remove getCurrentState method from FileStreamCache

Before you could do:

```
import {getFileStreamsCache} from '@atlaskit/media-client'

const currentFileState = await getFileStreamsCache().getCurrentState('some-uuid');
```

That will return the last state from that fileState in a promise rather than having to 
use Observables to subscribe and get the last event.

Now you could just use the already existing method getCurrentState from mediaClient:

```
import {getMediaClient} from '@atlaskit/media-client';

const mediaClient = getMediaClient({
  mediaClientConfig: {} // Some MediaClientConfig
});
const state = await mediaClient.file.getCurrentState('some-uuid');
```