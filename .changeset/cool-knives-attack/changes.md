Expose globalMediaEventEmitter to allow consumers to subscribe to global events rather than per context/mediaClient instance

```
//
// BEFORE
//
import {ContextFactory} from '@atlaskit/media-core'

const context = ContextFactory.create();

// Events happen per instance
context.on('file-added', ...)

//
// NOW
//

import {globalMediaEventEmitter} from '@atlaskit/media-client';

// Context happens globally on any upload. This is needed since there might be multiple mediaClient instances at runtime
globalMediaEventEmitter.on('file-added', ...);
```